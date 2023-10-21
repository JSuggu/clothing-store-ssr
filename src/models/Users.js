const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");

const Users = sequelize.define("users", {
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    names: {
        type: DataTypes.STRING(50),
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

    user_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            len: {
                args: [5, 30],
                msg: "El nombre de usuario debe contener entre 5 y 30 caracteres"
            }
        }
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            isEmail: {
                msg: "El campo tiene que ser un correo valido"
            }
        }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            }
        }
    }
});

module.exports = Users;