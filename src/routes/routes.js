const express = require("express");
const router = express.Router();
const userQueries = require("../controllers/queries/users");
const productsQueries = require("../controllers/queries/products");
const shoppingCartQueries = require("../controllers/queries/shopping-cart");
const restoredQuerie = require("../controllers/queries/restored-data");

//RUTA DE VISTAS
router.get("", (req, res) => {
    return res.render("home", {authorized: req.session.authorized});
})

router.get("/", (req, res) => {
    return res.render("home", {authorized: req.session.authorized});
})

router.get("/user", (req, res) => {
    if(!req.session.user)
        return res.redirect("login");
    const userData = {
        names: req.session.names,
        email: req.session.email,
        password: req.session.password
    }
    return res.render("user", {authorized: req.session.authorized, userData});
});

router.get("/login", (req, res) => {
    if(req.session.user)
        return res.redirect("user");
    return res.render("login", {message:"", authorized: req.session.authorized});
})

router.get("/checkin", (req, res) => {
    if(req.session.user)
        return res.redirect("user");
    return res.render("checkin", {authorized: req.session.authorized});
})

router.get("/shopping_cart", (req, res) => {
    if(req.session.user)
        return res.render("shopping_cart", {authorized: req.session.authorized});
    return res.redirect("login");
})

router.get("/log_out", (req, res) => {
    req.session.destroy();
    return res.redirect("login");
});


//RUTA DEL SERVIDOR
router.get("api", (req, res) => {return res.status(200).send("ok")})
router.get("/api", (req, res) => {return res.status(200).send("ok")})

//RUTA BACKUP
router.get("/api/database/backup/delete/data", restoredQuerie.deleteData);
router.get("/api/database/backup/add/data", restoredQuerie.addData);

//RUTAS PARA USUARIOS
router.get("/api/users/:id?", userQueries.users);
router.post("/api/check-in", userQueries.registerUser); //para cuando los clientes se registren
router.post("/api/add/user", userQueries.addUser); //para que el developer agregue usuarios
router.post("/login", userQueries.login);
router.put("/api/modify/names/:id?", userQueries.modifyNames);
router.put("/api/modify/user-name/:id?", userQueries.modifyUserName);
router.put("/api/modify/password/:id?", userQueries.modifyPassword);
router.put("/api/modify/email/:id?", userQueries.modifyEmail);
router.delete("/api/delete/user/:id?", userQueries.deleteUser);

//RUTAS PARA PRODUCTOS
router.get("/products", productsQueries.products);
router.get("/products/leaked-products", productsQueries.productsFiltered);
router.get("/clothe/:id/:name", productsQueries.clothe);
router.post("/api/add/product", productsQueries.addProduct);
router.put("/api/modify/product/:id", productsQueries.modifyProduct);
router.delete("/api/delete/product/:id", productsQueries.deleteProduct);

//RUTAS PARA EL CARRITO DE COMPRAS
router.get("/api/shopping-cart", shoppingCartQueries.getProductsOfUser);
router.post("/api/shopping-cart/add-product/:id", shoppingCartQueries.addProduct);
router.delete("/api/shopping-cart/delete-product/:id", shoppingCartQueries.deleteProduct);
router.delete("/api/shopping-cart/purchase", shoppingCartQueries.clearCart);

//RUTA PARA COMPRAR
router.get("/product/buy/:id", (req,res)=> {
    res.redirect("products");
});

//RUTAS CREAR ROLES DE USUARIOS, COLORES Y TIPOS DE ROPA
router.post("/api/add/user-role",userQueries.addRole);
router.get("/api/roles", userQueries.roles);
router.post("/api/add/clothes-color", productsQueries.addColor);
router.get("/api/colors", productsQueries.colors);
router.post("/api/add/clothes-kind", productsQueries.addType);
router.get("/api/kinds", productsQueries.types);
router.post("/api/add/sizes", productsQueries.addSize);
router.get("/api/sizes", productsQueries.sizes);

//RUTAS INEXISTENTE
router.get("/*",(req, res) => {return res.status(404).send("")});
router.post("/*",(req, res) => {return res.status(404).send("")});
router.put("/*",(req, res) => {return res.status(404).send("")});
router.delete("/*",(req, res) => {return res.status(404).send("")});

module.exports = router;

