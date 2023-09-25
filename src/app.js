const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const router = require("./routes/routes");
const dbconnection = require("./models/dbconnection");
require("dotenv").config({path: "../.env"});

const app = express();

//MIDDLEWARES
app.use(express.urlencoded({extendes:false}));
app.use(express.json());
app.use(cors());
app.use(helmet());

//SERVER
app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);
app.use(express.static(`../${__dirname}/public`));

app.use("/", router);

app.listen(process.env.PORT, (req, res) => {
    console.log("server start");
});