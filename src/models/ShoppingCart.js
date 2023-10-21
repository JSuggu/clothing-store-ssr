const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");
const Clothes = require("./Clothes");
const Users = require("./Users");

const ShoppingCart = sequelize.define("shopping_cart", {
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    amount: {
        type: DataTypes.SMALLINT,
        autoIncrement: false,
    }
});

Users.belongsToMany(Clothes, {
    through: ShoppingCart
});

Clothes.belongsToMany(Users, {
    through:ShoppingCart
});

module.exports = ShoppingCart;