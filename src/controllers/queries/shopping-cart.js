const ShoppingCart = require("../../models/ShoppingCart");
const Users = require("../../models/Users");
const Clothes = require("../../models/Clothes");

const queries = {
    getProductsOfUser: async function(req, res){
        const token = req.decoded;
        const userId = token.id;

        const isUser = await Users.findOne({
            where: {
                id: userId
            }
        });
        
        if(!isUser)
            return res.status(404).send({message:"El usuario no existe en la base de datos"});

        const products = await ShoppingCart.findAll({
            include: [
                {
                    model: Users,
                    attributes: ["names"]
                },
                
                {
                    model: Clothes,
                    attributes: ["name", "price", "url"]
                }
            ],
            
            where: {
                userId: userId
            }
            
        });

        if(products.length === 0)
            return res.status(404).send({message:"No tiene ningun producto agregado en el carrito"});

        return res.status(200).send({products});
    },

    addProduct: async function(req, res){
        const token = req.decoded;
        const productId = req.params.id;
        const userId = token.id;

        const isProduct = await Clothes.findOne({
            where: {
                id: productId
            }
        });

        if(!isProduct)
            return res.status(404).send({message: "El producto que intenta agregar no existe"});

        const isProductInCart = await ShoppingCart.findOne({
            where: {
                clotheId: productId,
                userId: userId 
            }
        }).catch (err => {
            return err;
        })

        if(isProductInCart){
            const productAmount = isProductInCart.amount;
            
            const updatedProductAmount = await ShoppingCart.update({amount: productAmount+1}, {
                where: {
                    id: isProductInCart.id
                }
            });

            return res.status(201).send({updatedProductAmount, message: "Ha agregado el mismo producto y se actualizo la cantidad"});
        }
        
        const addedProduct = await ShoppingCart.create({
            amount: 1,
            userId: userId,
            clotheId: productId,

        });
        
        return res.status(201).send({addedProduct, message: "Producto añadido"});
        
    },

    deleteProduct: async function(req, res){
        const token = req.decoded;
        const productId = req.params.id;
        const userId = token.id;

        const isProduct = await ShoppingCart.findOne({
            where: {
                clotheId: productId,
                userId: userId 
            }
        });

        if(!isProduct)
            return res.status(404).send({message: "El producto que intenta eliminar del carrito no existe"});

        const productAmount = isProduct.amount;

        if(productAmount === 1){
            const deleteProduct = await ShoppingCart.destroy({
                where: {
                    id: isProduct.id
                }
            });

            return res.status(200).send({deleteProduct, message: "El producto fue eliminado"});
        }

        const updatedProductAmount = await ShoppingCart.update({amount: productAmount-1}, {
            where: {
                id: isProduct.id
            }
        });

        return res.status(201).send({updatedProductAmount, message: "Elimino un producto que fue añadido varias veces y se actualizo la cantidad"});
    },

    clearCart: async function(req, res){
        const token = req.decoded;
        const userId = token.id;

        const priceProducts = await ShoppingCart.findAll({
            include: [
                {
                    model: Clothes,
                    attributes: ["price"]
                }
            ],

            where: {
                userId: userId
            }
        });
        
        if(priceProducts.length === 0)
            return res.status(404).send({message: "La compra no se ha realizado porque no hay productos en el carrito"});

        let totalPay = 0;

        priceProducts.forEach( element => {
            totalPay = totalPay + element.amount * element.clothe.price;
        });
    
        const clearCart = await ShoppingCart.destroy({
            where: {
                userId: userId
            }
        });

        return res.status(200).send({totalPay, clearCart, message: "Compra realizada, se han eliminado todos los productos del carrito"});
    
    }
}

module.exports = queries;