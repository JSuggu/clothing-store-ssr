const Users = require("../../models/Users");
const Clothes = require("../../models/Clothes");
const ShoppingCarts = require("../../models/ShoppingCarts");
const sequelize = require("../db-connection");

const queries = {
    getProductsOfUser: async function(req, res){
        const user = req.session.user;

        if(!user){
            return res.render("shopping_cart", {authorized:req.session.authorized, products: []});
        }

        const isUser = await Users.findOne({
            where: {
                user_name: user
            }
        });
        
        if(!isUser)
            return res.status(404).send({message:"El usuario no existe en la base de datos"});

        
        const products = await sequelize.query(`SELECT users.names, clothes.clothe_name, clothes.price, clothes.url, clothes.id, shopping_carts.amount 
            FROM clothes INNER JOIN shopping_carts ON "shopping_carts"."clotheId" = clothes.id INNER JOIN users ON users.id = "shopping_carts"."userId" 
            WHERE users.id = ${isUser.id};
        `);
        

        if(products.length === 0)
            return res.status(404).send({message:"No tiene ningun producto agregado en el carrito"});

        let totalPay = 0;
        products[0].forEach(clothe => {
            totalPay += clothe.price*clothe.amount;
        })

        return res.render("shopping_cart", {products: products[0], totalPay, authorized:req.session.authorized});
    },

    addProduct: async function(req, res){
        const productId = req.params.id;
        const user = req.session.user;

        const isProduct = await Clothes.findOne({
            where: {
                id: productId
            }
        });

        const isUser = await Users.findOne({
            where: {
                user_name: user
            }
        })

        if(!isProduct)
            return res.status(404).send({message: "El producto que intenta agregar no existe"});

        if(!isUser)
            return res.status(404).send({message: "El usuario no esta conectado"});

        const isProductInCart = await ShoppingCarts.findOne({
            where: {
                clotheId: productId,
                userId: isUser.id 
            }
        }).catch (err => {
            return err;
        })

        if(isProductInCart){
            const productAmount = isProductInCart.amount;
            
            const updatedProductAmount = await ShoppingCarts.update({amount: productAmount+1}, {
                where: {
                    id: isProductInCart.id
                }
            });

            return res.status(201).send({updatedProductAmount, message: "Ha agregado el mismo producto y se actualizo la cantidad"});
        }
        
        const addedProduct = await ShoppingCarts.create({
            amount: 1,
            userId: isUser.id,
            clotheId: productId,

        });
        
        return res.status(201).send({addedProduct, message: "Producto añadido"});
    },

    deleteProduct: async function(req, res){
        const productId = req.params.id;
        const username = req.session.user;

        const user = await Users.findOne({
            where: {
                user_name: username
            }
        });

        if(!user)
            return res.status(404).send({message: "Noy productos asociado a este usuario"});

        const isProduct = await ShoppingCarts.findOne({
            where: {
                clotheId: productId,
                userId: user.id 
            }
        });

        if(!isProduct)
            return res.status(404).send({message: "El producto que intenta eliminar del carrito no existe"});

        const productAmount = isProduct.amount;

        if(productAmount === 1){
            const deleteProduct = await ShoppingCarts.destroy({
                where: {
                    id: isProduct.id
                }
            });

            return res.status(200).send({deleteProduct, message: "El producto fue eliminado"});
        }

        const updatedProductAmount = await ShoppingCarts.update({amount: productAmount-1}, {
            where: {
                id: isProduct.id
            }
        });

        return res.status(201).send({updatedProductAmount, message: "Elimino un producto que fue añadido varias veces y se actualizo la cantidad"});
    },

    clearCart: async function(req, res){
        const username = req.session.user;

        const user = await Users.findOne({
            where: {
                user_name: username
            }
        });

        if(!user) return res.status(400).send({message: "El usuario no esta conectado"});

        const priceProducts = await sequelize.query(`SELECT clothes.price, shopping_carts.amount FROM clothes INNER JOIN shopping_carts 
        ON clothes.id = "shopping_carts"."clotheId" INNER JOIN users ON users.id = "shopping_carts"."userId" WHERE "userId" = ${user.id}`);

        if(priceProducts.length === 0)
            return res.status(404).send({message: "La compra no se ha realizado porque no hay productos en el carrito"});

        let totalPay = 0;

        priceProducts[0].forEach( clothe => {
            totalPay = totalPay + clothe.amount * clothe.price;
        });
    
        const clearCart = await ShoppingCarts.destroy({
            where: {
                userId: user.id
            }
        });

        return res.status(200).send({totalPay, clearCart, message: "Compra realizada, se han eliminado todos los productos del carrito"});
    
    }
}

module.exports = queries;