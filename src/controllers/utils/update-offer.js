const Clothes = require("../../models/Clothes");

const discounts = [10,30,15,50,10,20,20,10,15,30];

const updateOffer = function(){
    setInterval(async () => {
        const clothes = await Clothes.findAll({
            attributes: ["id"]
        });
        const size =  clothes.length;

        await Clothes.update({on_sale: false, discount: 0}, {where: {}});
        
        const indexProductsSet = makeSetProductToOffer(size);
        let discountsIndex = 0;
        indexProductsSet.forEach(index => {
            updateDbProduct(clothes[index], discounts[discountsIndex]);
            discountsIndex++;
        });

    }, 3600000)
}

function makeSetProductToOffer(limit){
    const indexProducts = new Set();
    while(indexProducts.size != 10){
        const number = (Math.random()*(limit-1))+1;
        const intNumber =  Math.floor(number);
        indexProducts.add(intNumber);
    }

    return indexProducts;
}

function updateDbProduct(product, discountToAdd){
    Clothes.update({
        on_sale: true,
        discount: discountToAdd,
        },
        {
            where: {
                id: product.id
            }
        })
}

module.exports = updateOffer;