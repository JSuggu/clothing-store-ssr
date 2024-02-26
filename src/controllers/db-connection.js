const { Sequelize } = require("sequelize");
const data =  require(`../../config`);

let sequelize;

if(process.env.NODE_ENV == "development"){
    sequelize = new Sequelize(data.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        storage: "./session.postgres",
        define: {timestamps: false},
        dialectOptions: {multipleStatements: true}
    });
} else {
    sequelize = new Sequelize(process.env.DB_URI, {
        dialect: "postgres",
        define: {timestamps: false},
        dialectOptions: {multipleStatements: true}
    });
}

module.exports = sequelize;

