const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const router = require("./routes/routes");
const sequelize = require("./controllers/db-connection");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const data = require("../config");
const updateOffer = require("./controllers/utils/update-offer");

const app = express();
updateOffer();

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
        reportOnly: false,
      })
);

//SERVER
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "/src/views"));
app.use(express.static("public"));
sequelize.sync();

app.use(session({
  secret: 'kicback',
  cookie: {
    path: '/',
    originalMaxAge: 3600000,
  },
  proxy: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
  saveUninitialized: true,
  resave: false
}));

app.use("/", router);

app.listen(data.PORT, (req, res) => {});

module.exports = app;