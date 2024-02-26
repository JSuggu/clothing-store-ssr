const path =  require("path");
const enviroment =  process.env.NODE_ENV;
let data =  require("dotenv").config({
    path: path.resolve(__dirname, `./environments/.env.${enviroment}`)
});

module.exports = {
    DB_HOST: data.parsed.DB_HOST,
    DB_USER: data.parsed.DB_USER,
    DB_PASSWORD: data.parsed.DB_PASSWORD,
    DB_DATABASE: data.parsed.DB_DATABSE,
    DB_PORT: data.parsed.DB_PORT
}
