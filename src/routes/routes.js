const express = require("express");
const router = express.Router();
const verifyToken = require("../controllers/verify-token");
const userQueries = require("../controllers/queries/users");
const productsQueries = require("../controllers/queries/products");
const shoppingCartQueries = require("../controllers/queries/shopping-cart");
const restoredQuerie = require("../controllers/queries/restored-data");

//RUTA DEL SERVIDOR
router.get("", (req, res) => {return res.status(200).send("ok")})
router.get("/", (req, res) => {return res.status(200).send("ok")})

//RUTA BACKUP
router.get("/database/backup/delete/data", verifyToken.developer, restoredQuerie.deleteData);
router.get("/database/backup/add/data", verifyToken.developer, restoredQuerie.addData);

//RUTAS PARA USUARIOS
router.get("/users/:id?", verifyToken.admin, userQueries.users);
router.post("/check-in", userQueries.registerUser); //para cuando los clientes se registren
router.post("/add/user", verifyToken.developer, userQueries.addUser); //para que el developer agregue usuarios
router.post("/log-in", userQueries.login);
router.put("/modify/names/:id?", verifyToken.customer, userQueries.modifyNames);
router.put("/modify/user-name/:id?", verifyToken.customer, userQueries.modifyUserName);
router.put("/modify/password/:id?", verifyToken.customer, userQueries.modifyPassword);
router.put("/modify/email/:id?", verifyToken.customer, userQueries.modifyEmail);
router.delete("/delete/user/:id?", verifyToken.customer, userQueries.deleteUser);


//RUTAS PARA PRODUCTOS
router.get("/products/:kind?", productsQueries.products);
router.post("/add/product", verifyToken.admin, productsQueries.addProduct);
router.put("/modify/product/:id", verifyToken.admin, productsQueries.modifyProduct);
router.delete("/delete/product/:id", verifyToken.admin, productsQueries.deleteProduct);

//RUTAS PARA EL CARRITO DE COMPRAS
router.get("/shopping-cart", verifyToken.customer, shoppingCartQueries.getProductsOfUser);
router.post("/shopping-cart/add-product/:id", verifyToken.customer, shoppingCartQueries.addProduct);
router.delete("/shopping-cart/delete-product/:id", verifyToken.customer, shoppingCartQueries.deleteProduct);
router.delete("/shopping-cart/purchase", verifyToken.customer, shoppingCartQueries.clearCart);

//RUTAS CREAR ROLES DE USUARIOS, COLORES Y TIPOS DE ROPA
router.post("/add/user-role", verifyToken.developer,userQueries.addRole);
router.get("/roles", verifyToken.admin, userQueries.roles);
router.post("/add/clothes-color", verifyToken.admin, productsQueries.addColor);
router.get("/colors", productsQueries.colors);
router.post("/add/clothes-kind", verifyToken.admin, productsQueries.addType);
router.get("/kinds", productsQueries.types);
router.post("/add/sizes", verifyToken.admin, productsQueries.addSize);
router.get("/sizes", productsQueries.sizes);

//RUTAS INEXISTENTE
router.get("/*",(req, res) => {return res.status(404).send("")});
router.post("/*",(req, res) => {return res.status(404).send("")});
router.put("/*",(req, res) => {return res.status(404).send("")});
router.delete("/*",(req, res) => {return res.status(404).send("")});

module.exports = router;

