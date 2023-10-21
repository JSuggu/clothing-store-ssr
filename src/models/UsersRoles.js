const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");
const Users  = require("./Users");

const UsersRole = sequelize.define("users_roles", {
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    role_name: {
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
    },

    priority: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "El campo no puede estar vacio"
            },
            isNumeric: {
                args: true,
                msg: "La prioridad debe tener un valor numerico, siendo 1 el que tiene mayor prioridad"
            }
        }
    }
});

UsersRole.hasMany(Users, {
    foreignKey: "role_id",
    sourceKey: "id"
});
Users.belongsTo(UsersRole, {
    foreignKey: "role_id",
    targetId: "id"
});

module.exports = UsersRole;
