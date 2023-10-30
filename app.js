const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const router = require("./src/routes/routes");
const sequelize = require("./src/controllers/db-connection");
require("dotenv").config({path: "./.env"});

const app = express();

//MIDDLEWARES
app.use(express.urlencoded({extendes:false}));
app.use(express.json());
app.use(cors());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
          "default-src": ["'self'"],
          "font-src": [
            "'self'",
            "i.ibb.co",
          ],
          "img-src": ["'self'", "data:", "https://i.ibb.co"],
        },
        reportOnly: true,
      })
);

//SERVER
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/src/views"));
app.use(express.static("public"));
app.use("/", router);


app.listen(process.env.PORT, (req, res) => {
    sequelize.sync();
});

module.exports = app;