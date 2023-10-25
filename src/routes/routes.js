const express = require("express");
const router = express.Router();
const verifyToken = require("../controllers/verify-token");
const userQueries = require("../controllers/queries/users");
const productsQueries = require("../controllers/queries/products");
const shoppingCartQueries = require("../controllers/queries/shopping-cart");
const restoredQuerie = require("../controllers/queries/restored-data");

//RUTA DE VISTAS
router.get("", (req, res) => {
    return res.render("home");
})

router.get("/", (req, res) => {
    return res.render("home");
})

router.get("/login", (req, res) => {
    return res.render("login");
})

router.get("/checkin", (req, res) => {
    return res.render("checkin");
})

router.get("/shopping_cart", (req, res) => {
    return res.render("shopping_cart");
})


//RUTA DEL SERVIDOR
router.get("api", (req, res) => {return res.status(200).send("ok")})
router.get("/api", (req, res) => {return res.status(200).send("ok")})

//RUTA BACKUP
router.get("/api/database/backup/delete/data", verifyToken.developer, restoredQuerie.deleteData);
router.get("/api/database/backup/add/data", verifyToken.developer, restoredQuerie.addData);

//RUTAS PARA USUARIOS
router.get("/api/users/:id?", verifyToken.admin, userQueries.users);
router.post("/api/check-in", userQueries.registerUser); //para cuando los clientes se registren
router.post("/api/add/user", verifyToken.developer, userQueries.addUser); //para que el developer agregue usuarios
router.post("/api/log-in", userQueries.login);
router.put("/api/modify/names/:id?", verifyToken.customer, userQueries.modifyNames);
router.put("/api/modify/user-name/:id?", verifyToken.customer, userQueries.modifyUserName);
router.put("/api/modify/password/:id?", verifyToken.customer, userQueries.modifyPassword);
router.put("/api/modify/email/:id?", verifyToken.customer, userQueries.modifyEmail);
router.delete("/api/delete/user/:id?", verifyToken.customer, userQueries.deleteUser);


//RUTAS PARA PRODUCTOS
router.get("/products", productsQueries.products);
router.post("/api/add/product", verifyToken.admin, productsQueries.addProduct);
router.put("/api/modify/product/:id", verifyToken.admin, productsQueries.modifyProduct);
router.delete("/api/delete/product/:id", verifyToken.admin, productsQueries.deleteProduct);

//RUTAS PARA EL CARRITO DE COMPRAS
router.get("/api/shopping-cart", verifyToken.customer, shoppingCartQueries.getProductsOfUser);
router.post("/api/shopping-cart/add-product/:id", verifyToken.customer, shoppingCartQueries.addProduct);
router.delete("/api/shopping-cart/delete-product/:id", verifyToken.customer, shoppingCartQueries.deleteProduct);
router.delete("/api/shopping-cart/purchase", verifyToken.customer, shoppingCartQueries.clearCart);

//RUTAS CREAR ROLES DE USUARIOS, COLORES Y TIPOS DE ROPA
router.post("/api/add/user-role", verifyToken.developer,userQueries.addRole);
router.get("/api/roles", verifyToken.admin, userQueries.roles);
router.post("/api/add/clothes-color", verifyToken.admin, productsQueries.addColor);
router.get("/api/colors", productsQueries.colors);
router.post("/api/add/clothes-kind", verifyToken.admin, productsQueries.addType);
router.get("/api/kinds", productsQueries.types);
router.post("/api/add/sizes", verifyToken.admin, productsQueries.addSize);
router.get("/api/sizes", productsQueries.sizes);

//RUTAS INEXISTENTE
router.get("/*",(req, res) => {return res.status(404).send("")});
router.post("/*",(req, res) => {return res.status(404).send("")});
router.put("/*",(req, res) => {return res.status(404).send("")});
router.delete("/*",(req, res) => {return res.status(404).send("")});

module.exports = router;

