const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");

const ClothesColor = sequelize.define("clothes_colors", {
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    color_name: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "El campo no puede estar vacio"
            },
            isAlpha: {
                args: true,
                msg: "El color no puede contener valores numericos"
            }
        }
    }
});

module.exports = ClothesColor;