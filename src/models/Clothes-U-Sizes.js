const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");
const Clothes = require("./Clothes");
const ClothesSize = require("./ClotheSizes");

const ClothesUSize = sequelize.define("clothes_u_sizes", {
    id: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
});

ClothesSize.belongsToMany(Clothes, {
    through: ClothesUSize
});

Clothes.belongsToMany(ClothesSize, {
    through: ClothesUSize
})

module.exports = ClothesUSize;