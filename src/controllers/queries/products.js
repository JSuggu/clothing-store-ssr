const Clothes = require("../../models/Clothes"); 
const ClothesColor = require("../../models/ClothesColors"); 
const ClothesType = require("../../models/ClothesTypes");
const ClothesSize = require("../../models/ClotheSizes");
const ClothesUColor = require("../../models/Clothes-U-Colors");
const ClothesUSize = require("../../models/Clothes-U-Sizes");

//Conjunto que uso para verificar en los condicionales si se ingreso algun tipo de dato que no es valido
const invalidData = new Set([undefined, null, NaN, ""]);

const queries = {
        //COLORES DE LAS ROPAS
        colors: async function(_, res){
            const allColors = await ClothesColor.findAll();
            return res.status(200).send({allColors});
        },
    
        addColor: async function(req, res){
            const name = req.body.name;
    
            if(invalidData.has(name))
                return res.status(400).send({message: "No ha ingresado ningun color"});
    
            //Creo el color y lo inserto en la tabla "clothes_color" en la base de datos;
            const newColor = await ClothesColor.create({
                name: name,
            }).catch(err =>{
                return err;
            });
    
            if(newColor.name == "SequelizeValidationError")
                return res.status(400).send({error: newColor.errors, message: "El color de la ropa no pudo añadirse"});
    
            return res.status(201).send({newColor, message:"Color añadido correctamente"})
        },
    
        //TIPOS DE ROPA
        types: async function(_, res){
            const allTypes = await ClothesType.findAll();
            return res.status(200).send({allTypes});
        },
    
        addType: async function(req, res){
            const name = req.body.name;
    
            if(invalidData.has(name))
                return res.status(400).send({message: "No ha ingresado ningun tipo de ropa"});
    
            //Creo el tipo de ropa y lo inserto en la tabla "clothes_type" en la base de datos;
            const newType = await ClothesType.create({
                name: name
            }).catch(err =>{
                return err;
            });
    
            if(newType.name == "SequelizeValidationError")
                return res.status(400).send({error: newType.errors, message: "El tipo de ropa no pudo añadirse"});
            
            return res.status(201).send({newType, message:"Tipo de ropa añadido correctamente"})
        },

        sizes: async function(_, res){
            const allSizes = await ClothesSize.findAll();
            return res.status(200).send({allSizes});
        },

        addSize: async function(req, res){
            const name = req.body.name;
    
            if(invalidData.has(name))
                return res.status(400).send({message: "No ha ingresado ningun tipo de ropa"});
    
            //Creo el tipo de ropa y lo inserto en la tabla "clothes_type" en la base de datos;
            const newType = await ClothesSize.create({
                name: name
            }).catch(err =>{
                return err;
            });
    
            if(newType.name == "SequelizeValidationError")
                return res.status(400).send({error: newType.errors, message: "El tipo de ropa no pudo añadirse"});
            
            return res.status(201).send({newType, message:"Tipo de ropa añadido correctamente"})
        },
    
        //PARA LOS PRODUCTOS
        products: async function(req, res){
            const clotheType = req.params.kinds;
            
            if(!invalidData.has(clotheType) && clotheType != "none"){
                const type = await ClothesType.findOne({
                    where: {
                        type_name: clotheType
                    }
                }).catch(err => {return err})
                
                if(!type)
                    return res.status(400).send("El tipo de ropa no existe");

                const allProductsFiltered = await Clothes.findAll({
                    include: [
                        {
                            model: ClothesType,
                            attributes: ["type_name"]
                        },

                        {
                            model: ClothesColor,
                            attributes: ["color_name"]
                        },
                        
                        {
                            model: ClothesSize,
                            attributes: ["size"]
                        }
                    ],
                    attributes: ["id", "clothe_name", "price", "url"],
                    where: {
                        type_id: type.id
                    }
                });
                
                return res.status(200).send({allProducts: allProductsFiltered});
            }

            const allProducts = await Clothes.findAll({
                include: [
                    {
                        model: ClothesType,
                        attributes: ["type_name"]
                    },

                    {
                        model: ClothesColor,
                        attributes: ["color_name"]
                    },
                    
                    {
                        model: ClothesSize,
                        attributes: ["size"]
                    }
                ],
                attributes: ["id", "clothe_name", "price", "url"]
            });

            return res.status(200).send({allProducts});
        },
    
        //Completar esta funcion para color y tipo representen un id de sus respectivas tablas
        addProduct: async function(req, res){
            const {name, price, url} = req.body;
            let {color, type, size} = req.body;
    
            if(invalidData.has(name) || invalidData.has(price))
                return res.status(400).send({message: "El producto debe tener un nombre y un precio"});
    
            //Condiciales que verifican si el admin ingreso un color o un tipo de ropa valido,
            //si es verdadero hace una consulta a la tabla de color y tipo de ropa y obtiene el id al que hacen referencia

            if(!invalidData.has(type)){
                type = await ClothesType.findOne({
                    where:{
                        type_name: type
                    }
                })
    
                if(!invalidData.has(type)){
                    type = type.id;
                }
            } else {
                type = null;
            }

            if(!type)
                return res.status(400).send("No se le asigno un tipo a la ropa");

            if(!invalidData.has(color)){
                color = await ClothesColor.findOne({
                    where:{
                        color_name: color
                    }
                });
    
                if(!invalidData.has(color)){
                    color = color.id;
                }
            } else {
                color = null;
            }

            if(!invalidData.has(size)){
                size = await ClothesSize.findOne({
                    where:{
                        size: size
                    }
                })
    
                if(!invalidData.has(size)){
                    size = size.id;
                }
            } else {
                size = null;
            }

            const newProduct = await Clothes.create({
                clothe_name: name,
                price: price,
                url: url,
                type_id: type
            }).catch(err =>{
                return err;
            });
            
            if(newProduct.name == "SequelizeValidationError" || newProduct.name == "SequelizeDatabaseError")
                return res.status(400).send({error: newProduct.errors, message: "El producto no pudo añadirse"});
            
            ClothesUColor.create({
                clotheId: newProduct.id,
                clothesColorId: color
            });

            ClothesUSize.create({
                clotheId: newProduct.id,
                clothesSizeId: size
            });
            
            return res.status(201).send({newProduct, message: "Producto añadido correctamente"});
        },
    
        modifyProduct: async function(req, res){
            const {name, price, url} = req.body;
            let {color, type, size} = req.body;
            const token = req.decoded;
            const id = req.params.id;
            
            if(token.users_role.priority > 2)
                return res.status(403).send({message:"El usuario no tiene los permisos necesario"});
            
            if(invalidData.has(name) || invalidData.has(price) || invalidData.has(type))
                return res.status(400).send({message:"El producto debe tener un nombre, precio y tipo"});
            
            if(!invalidData.has(type)){
                type = await ClothesType.findOne({
                    where:{
                        type_name: type
                    }
                });
        
                if(!invalidData.has(type)){
                    type = type.id;
                }
            } else {
                type = null;
            }

            if(!type)
                return res.status(400).send("No se le asigno un tipo a la ropa");
    
            if(!invalidData.has(color)){
                color = await ClothesColor.findOne({
                    where:{
                        color_name: color
                    }
                });
    
                if(!invalidData.has(color)){
                    color = color.id;
                } 
            } else {
                color = null;
            }

            if(!invalidData.has(size)){
                size = await ClothesSize.findOne({
                    where:{
                        size: size
                    }
                });
        
                if(!invalidData.has(size)){
                    size = size.id;
                }
            } else {
                size = null;
            }
    
            const productUpdated = await Clothes.update({
                clothe_name: name,
                price: price,
                url: url,
                type_id: type
                }, {
                    where: {
                        id: id
                    }
            }).catch(err => {
                return err
            });
    
            if(productUpdated == 0)
                return res.status(404).send({message: "El producto que intento modifcar no existe y no se ha producido ningun cambio"});
    
            if(productUpdated.name == "SequelizeValidationError" || productUpdated.name == "SequelizeDatabaseError")
                return res.status(400).send({error: productUpdated.parent, message: "El producto no pudo actualizarce"});
    
            await ClothesUColor.update({
                clotheId: id,
                clothesColorId: color
                }, {
                    where: {
                        clotheId: id
                    }
            }).catch(err =>{
                return err;
            });

            await ClothesUSize.update({
                clotheId: id,
                clothesSizeId: size
                }, {
                    where: {
                        clotheId: id
                    }
            }).catch(err =>{
                return err;
            });

            return res.status(201).send({productUpdated, message:"Producto actulizado correctamente"});
        },
    
        deleteProduct: async function(req, res){
            const token = req.decoded;
            const id = req.params.id;
            
            if(token.users_role.priority > 2)
                return res.status(403).send({message:"No tiene los permisos para eliminar productos"});
            
            const productDeleted = await Clothes.destroy({
                where: {
                    id: id
                }
            });
    
            if(productDeleted == 0)
                return res.status(404).send({message:"El producto que esta intentando eliminar no exite"});

            await ClothesUColor.destroy({
                where: {
                    clotheId: id
                }
            });

            await ClothesUSize.destroy({
                where: {
                    clotheId: id
                }
            });
            
            return res.status(200).send({productDeleted, message:"El producto ha sido eliminado"});
        },
}

module.exports = queries;