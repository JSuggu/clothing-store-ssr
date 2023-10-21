const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");
const Clothes = require("./Clothes");
const ClothesColor = require("./ClothesColors");

const ClothesUColor = sequelize.define("clothes_u_colors", {
    id: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    }
});

ClothesColor.belongsToMany(Clothes, {
    through: ClothesUColor
});

Clothes.belongsToMany(ClothesColor, {
    through:ClothesUColor
})

module.exports = ClothesUColor;