const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");
const Clothes = require("./Clothes");
const Users = require("./Users");

const ShoppingCarts = sequelize.define("shopping_carts", {
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

Clothes.belongsToMany(Users, {through: ShoppingCarts});
Users.belongsToMany(Clothes, {through: ShoppingCarts});

module.exports = ShoppingCarts;