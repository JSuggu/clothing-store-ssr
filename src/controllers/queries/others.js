const ClotheSize = require("../../models/ClotheSizes");
const Clothes = require("../../models/Clothes");
const ClothesColor = require("../../models/ClothesColors");
const ClothesType = require("../../models/ClothesTypes");

const queries = {
    buyProduct: function(req, res){
        return res.render("buy_success", {
            authorized: req.session.authorized, 
            message:"producto comprado", 
            clotheId: req.params.id,
            clotheName: req.params.name,
            totalPay: null
        });
    },

    productToShowInHome: async function(req, res){
        const productsMostView =  await Clothes.findAll({
            include: [
                {
                    model: ClothesType,
                    attributes: ["type_name"]
                },

                {
                    model: ClotheSize,
                    attributes: ["size"]
                },

                {
                    model: ClothesColor,
                    attributes: ["color_name"]
                }
            ],
            attributes: ["id", "clothe_name", "price", "url", "discount"],
            where: {
                on_sale: true
            }
        });

        return productsMostView
    }
}

module.exports = queries;