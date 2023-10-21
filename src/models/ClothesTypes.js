const sequelize = require("../controllers/db-connection");
const { DataTypes } = require("sequelize");
const Clothes = require("./Clothes");

const ClothesType = sequelize.define("clothes_types", {
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },

    type_name: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "El campo no puede estar vacio"
            },
            isAlpha: {
                args: true,
                msg: "El tipo de ropa no puede contener valores numericos"
            }
        }
    }
});

ClothesType.hasMany(Clothes, {
    foreignKey: "type_id",
    sourceKey: "id"
});
Clothes.belongsTo(ClothesType, {
    foreignKey: "type_id",
    targetId: "id"
})


module.exports = ClothesType;