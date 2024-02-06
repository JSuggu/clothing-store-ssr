const othersQueries = require("../queries/others");

//Conjunto que uso para verificar en los condicionales si se ingreso algun tipo de dato que no es valido

const queries = {
    homeView: async function(req, res){
        const productsToHome = await othersQueries.productToShowInHome(req, res);

        return res.render("home", {
            authorized: req.session.authorized,
            products: productsToHome
        });
    },

    userView: function(req, res){
        if(!req.session.user)
            return res.redirect("login");
        const userData = {
            names: req.session.names,
            email: req.session.email,
            password: req.session.password
        }
        return res.render("user", {authorized: req.session.authorized, userData});
    },

    loginView: function(req, res){
        if(req.session.user)
            return res.redirect("user");
        return res.render("login", {message:"", authorized: req.session.authorized});
    },

    checkinView: function(req, res){
        if(req.session.user)
            return res.redirect("user");
        return res.render("checkin", {authorized: req.session.authorized});
    },

    logout: function(req, res){
        req.session.destroy();
        return res.redirect("login");
    }

}

module.exports = queries;