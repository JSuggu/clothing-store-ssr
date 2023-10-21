const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");

const Clothes = sequelize.define("clothes", {
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    clothe_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },

            is: {
                args: [/^[a-zA-Z\s]+$/],
                msg: "El nombre solo debe tener letras y espacios"
            }
        }
    },

    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            isNumeric: {
                args: true,
                msg: "El precio debe ser un valor numerico"
            }
        }
    },

    url: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
});

module.exports = Clothes;