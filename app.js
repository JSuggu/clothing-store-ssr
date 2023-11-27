const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const router = require("./src/routes/routes");
const sequelize = require("./src/controllers/db-connection");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
require("dotenv").config({path: "./.env"});

const app = express();

//MIDDLEWARES
app.use(express.urlencoded({extends:false}));
app.use(express.json());
app.use(cookieParser());

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
sequelize.sync();

app.use(session({
  secret: 'kicback',
  cookie: {
    path: '/',
    originalMaxAge: 3600000,
    secure: false,
    sameSite: 'none'
  },
  proxy: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
  saveUninitialized: true,
  resave: false
}))

app.use("/", router);

app.listen(process.env.PORT, (req, res) => {});

module.exports = app;