const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");

const ClotheSize = sequelize.define("clothes_sizes", {
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    size: {
        type: DataTypes.STRING(10),
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

module.exports = ClotheSize;