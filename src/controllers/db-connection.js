const { Sequelize } = require("sequelize");
const data =  require(`../../config`);

let sequelize;

if(process.env.NODE_ENV == "development"){
    sequelize = new Sequelize(data.DB_DATABASE, data.DB_USER, data.DB_PASSWORD, {
        host: data.DB_HOST,
        port: data.DB_PORT,
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

