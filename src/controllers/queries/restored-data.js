const fs = require("fs");
const readline = require("readline");
const path = require("path");
const ClothesColor = require("../../models/ClothesColors");
const ClothesType = require("../../models/ClothesTypes");
const ClothesSize = require("../../models/ClotheSizes");
const UsersRole = require("../../models/UsersRoles");
const Clothes = require("../../models/Clothes");
const Users = require("../../models/Users");
const ClothesUColor = require("../../models/Clothes-U-Colors");
const ClothesUSize = require("../../models/Clothes-U-Sizes");

const colorsIdMap = new Map([
    ["rojo", 1],
    ["azul", 2,],
    ["amarillo", 3,],
    ["negro", 4,],
    ["marron", 5]
]);

const typesIdMap = new Map([
    ["calzado", 1],
    ["pantalon", 2],
    ["remera", 3]
]);

const sizesIdMap = new Map([
    ["M", 1],
    ["L", 2],
    ["XL", 3]
]);

const colors = [{color_name: "rojo"}, {color_name: "azul"}, {color_name: "amarillo"}, {color_name: "negro"}, {color_name: "marron"}];
const types = [{type_name: "calzado"}, {type_name: "pantalon"}, {type_name: "remera"}];
const sizes = [{size: "M"}, {size: "L"}, {size: "XL"}];
const roles = [{role_name: "developer", priority: "1"}, {role_name: "admin", priority: "2"}, {role_name: "customer", priority: "3"}];

const users = [
    {names: "developer", user_name: "developer", email: "developer@gmail.com", password: "$2b$08$LqK3rgTPa2/XyvgEv/UPkO4jw1Fj78oi1WeAeB1f4N2I/0x7sk/ve", role_id: 1},
    {names: "admin", user_name: "admin", email: "admin@gmail.com", password: "$2b$08$/5vVjfQtiTzYBWT5BI/UQuTi9QZ5FYpD7Xx4wS8rKo31rR3SYkb0a", role_id: 2},
    {names: "customer", user_name: "customer", email: "customer@gmail.com", password: "$2b$08$kMXrxMTrIVm7Al9zK.cBvei3rspheJpN4zfilyCAzlPcHE8lTQqVK", role_id: 3}
];

const queries = {
    deleteData: async function(req, res){
        ClothesColor.destroy({where: {}, truncate: true, cascade: true});
        ClothesType.destroy({where: {}, truncate: true, cascade: true});
        ClothesSize.destroy({where: {}, truncate: true, cascade: true});
        UsersRole.destroy({where: {}, truncate: true, cascade: true});
        Clothes.destroy({where: {}, truncate: true, cascade: true});
        Users.destroy({where: {}, truncate: true, cascade: true});
        ClothesUColor.destroy({where: {}, truncate: true, cascade: true});
        ClothesUSize.destroy({where: {}, truncate: true, cascade: true});
        
        return res.status(201).send({message:"backup realizado correctamente"});
    },

    addData: async function(req, res){
        await ClothesType.bulkCreate(types);
        await ClothesColor.bulkCreate(colors);
        await ClothesSize.bulkCreate(sizes);
        await UsersRole.bulkCreate(roles);
        await insertClothes();
        await Users.bulkCreate(users);
        return res.status(201).send({message:"backup realizado correctamente"});
    }
}

const insertClothes = async () => {
    const clotheFile = readline.createInterface(fs.createReadStream(path.resolve(__dirname, "../../../files/clothe-list.svg")));
    const clothes = [], clothesColor = [], clothesSize = [];

    clotheFile.on("line", async (line) => {
        const [clothe_name, price, url, type_name, colors, sizes] = line.split(",");
        const type_id = typesIdMap.get(type_name);
        clothes.push({clothe_name, price, url, type_id});
        clothesColor.push(colors);
        clothesSize.push(sizes);
    });
    
    clotheFile.on("close", async () =>{
        const result = await Clothes.bulkCreate(clothes);
        const clothesUnionColor = [], clothesUnionSize = [];
    
        let count = 0;
        result.forEach(clothe => {
    
            clothesColor[count].split("|").forEach(color =>{
                if(color != "null")
                    clothesUnionColor.push({clotheId: clothe.id, clothesColorId: colorsIdMap.get(color)});
            });
    
            clothesSize[count].split("|").forEach(size =>{
                if(size != "null")
                    clothesUnionSize.push({clotheId: clothe.id, clothesSizeId: sizesIdMap.get(size)});
            });
            
            count++;
        });

        await ClothesUColor.bulkCreate(clothesUnionColor);
        await ClothesUSize.bulkCreate(clothesUnionSize);
    });

    return;
}

module.exports = queries;