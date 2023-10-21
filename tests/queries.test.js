const supertest = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const routes = require("../src/routes/routes");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use("/", routes);
const api = supertest(app);


const devUser = { id: 1, userName: "developer", password: bcrypt.hashSync("developer123", 8), users_role: {name: "developer", priority: 1} }
const adminUser = { id: 2, userName: "admin", password: bcrypt.hashSync("admin123", 8), users_role: {name: "admin", priority: 2} }
const customerUser = { id: 3, userName: "customer", password: bcrypt.hashSync("customer123", 8), users_role: {name: "customer", priority: 3} }
const newCustomerUser = { id: 4, userName: "newCustomer", password: bcrypt.hashSync("newCustomer123", 8), users_role: {name: "customer", priority: 3} }

const devToken = jwt.sign(devUser, "developer123", {expiresIn: "7d"});
const adminToken = jwt.sign(adminUser, "admin123", {expiresIn: "7d"});
const customerToken = jwt.sign(customerUser, "customer123", {expiresIn: "7d"});
const newCustomerToken = jwt.sign(newCustomerUser, "customer123", {expiresIn: "7d"});

const clothe = { name: "camisa de verano", price: "1500", color: "azul", type: "remera", size: "L" }
const clothe1 = { name: "", price: "1500", color: "azul", type: "calzado", size: "" }
const clothe2 = { name: "zapato 3/4", price: "1500", color: "amarillo", type: "calzado", size: "" }

const modifiedClothing = { name: "camisa de verano", price: "2000", color: "amarillo", type: "remera", size: "XL" }
const modifiedClothing1= { name: "", price: "", color: "azul", type: "calzado", size: "" }
const mofiedClothing2= { name: "zapato de niños 11", price: "2000", color: "azul", type: "calzado", size: ""  }

const userForCheckin = { names: "franco suggu", userName: "suggu98", email: "franco@gmail.com", password: "franco123", role: "customer" }
const userForCheckin1 = { names: "", userName: "", email: "", password: "", role: "" }
const userForCheckin2 = { names: "juan reja", userName: "reja98", email: "reja@gmail.com", password: "reja123", role: "administrador de base de datos" }
const userForCheckin3 = { names: "agus ontar", userName: "ontarlogar97", email: "ontar", password: "ontar123", role: "admin" }
const userForCheckin4 = { names: "admin", userName: "admin", email: "admin@gmail.com", password: "admin123", role: "admin"}
const userForCheckin5 = { names: "luchito apollo", userName: "apollo", email: "apollo@gmail.com", password: "apollo123", role: "customer"}

const userForLogin = { userName: "", password: ""}
const userForLogin1 = { userName: "franco", password: "franco123"}
const userForLogin2 = { userName: "admin", password: "123"}
const userForLogin3 = { userName: "admin", password: "admin123"}

const modifiedNamesForUser = { names: "" }
const modifiedNamesForUser1 = { names: "franco azame" }
const modifiedUserNameForUser = { userName: "" }
const modifiedUserNameForUser1 = { userName: "suggu" }
const modifiedPasswordForUser = { oldPassword: "", newPassword: "" }
const modifiedPasswordForUser1 = { oldPassword: "customer123", newPassword: "suggu123" }
const modifiedPasswordForUser2 = { oldPassword: "newCustomer123", newPassword: "suggu123" }
const modifiedEmailForUser = { email: "" }
const modifiedEmailForUser1 = { email: "suggu@gmail.com" }


describe("GET/POST/PUT/DELETE /asdasd, invalid route", () => {
    it("responds status 404", done => {
        api
        .get("/delete/product/")
        .set('Accept', 'application/json')
        .set("Authorization", devToken)
        .expect('Content-Type', /text\/html/)
        .expect(404, done)
    });
});

/****************** PRODUCT QUERIES ******************/

describe("Products Queries", () => {

    describe("Method: GET, Route: don't exist", () => {
        it('responds with status 404', done => {
            api
            .get('/produc')
            .set('Accept', 'application/json')
            .expect(404, done);
          });
    });

    describe("Method: GET, Route: /products, obtain all products", () => {
        it("responds with status 200", done => {
            api
            .get('/products')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
    });

    
    describe("Method: POST, Route: /add/product", () => {

        describe("unnamed product", () => {
            it("responds status 400", done => {
                api
                .post("/add/product")
                .send(JSON.stringify(clothe1))
                .set("Content-type", "application/json")
                .set('Accept', 'application/json')
                .set("Authorization", devToken)
                .expect('Content-Type', /application\/json/)
                .expect(400, done)
            })
        });
    
        describe("invalid name, price or type of product", () => {
            it("responds status 400", done => {
                api
                .post("/add/product")
                .send(JSON.stringify(clothe2))
                .set("Content-type", "application/json")
                .set('Accept', 'application/json')
                .set("Authorization", devToken)
                .expect('Content-Type', /application\/json/)
                .expect(400, done)
            })
        });
    
        describe("no token", () => {
            it("responds status 401", done => {
                api
                .post("/add/product")
                .send(JSON.stringify(clothe))
                .set("Content-type", "application/json")
                .set('Accept', 'application/json')
                .expect('Content-Type', /application\/json/)
                .expect(401, done)
            })
        });
    
        describe("successfully added product", () => {
            it("responds status 201", done => {
                api
                .post("/add/product")
                .send(JSON.stringify(clothe))
                .set("Content-type", "application/json")
                .set('Accept', 'application/json')
                .set("Authorization", devToken)
                .expect('Content-Type', /application\/json/)
                .expect(201, done)
            })
        });
    });
    

    describe("Method: PUT, Route: /modify/product/:id", () => {

        describe("no id", () => {
            it("responds status 404", done => {
                api
                .put("/modify/product/")
                .send(JSON.stringify(modifiedClothing))
                .set("Content-type", "application/json")
                .set('Accept', 'application/json')
                .set("Authorization", devToken)
                .expect('Content-Type', /text\/html/)
                .expect(404, done)
            });
        });
    
        describe("no permissions", () => {
            it("responds status 401", done => {
                api
                .put("/modify/product/10")
                .send(JSON.stringify(modifiedClothing))
                .set("Content-type", "application/json")
                .set('Accept', 'application/json')
                .set("Authorization", customerToken)
                .expect('Content-Type', /application\/json/)
                .expect(401, done)
            });
        });
        
        describe("unnamed or no price", () => {
            
            it("responds status 400", done => {
                api
                .put("/modify/product/10")
                .send(JSON.stringify(modifiedClothing1))
                .set("Content-type", "application/json")
                .set('Accept', 'application/json')
                .set("Authorization", devToken)
                .expect('Content-Type', /application\/json/)
                .expect(400, done)
            });
        });
    
        describe("invalid name, price or type", () => {
            
            it("responds status 400", done => {
                api
                .put("/modify/product/10")
                .send(JSON.stringify(mofiedClothing2))
                .set("Content-type", "application/json")
                .set('Accept', 'application/json')
                .set("Authorization", devToken)
                .expect('Content-Type', /application\/json/)
                .expect(400, done)
            });
        });
        
        describe("invalid id", () => {
            
            it("responds status 404", done => {
                api
                .put("/modify/product/100")
                .send(JSON.stringify(modifiedClothing))
                .set("Content-type", "application/json")
                .set('Accept', 'application/json')
                .set("Authorization", devToken)
                .expect('Content-Type', /application\/json/)
                .expect(404, done)
            });
        });
    
        describe("successfully updated product", () => {
            
            it("responds status 201", done => {
                api
                .put("/modify/product/10")
                .send(JSON.stringify(modifiedClothing))
                .set("Content-type", "application/json")
                .set('Accept', 'application/json')
                .set("Authorization", devToken)
                .expect('Content-Type', /application\/json/)
                .expect(201, done)
            });
        });
    });
    

    describe("Method: DELETE, Route: /delete/product/:id", () => {
        describe("no permissions", () => {
            it("responds status 401", done => {
                api
                .delete("/delete/product/10")
                .set('Accept', 'application/json')
                .set("Authorization", customerToken)
                .expect('Content-Type', /application\/json/)
                .expect(401, done)
            });
        });
    
        describe("invalid id", () => {
            it("responds status 404", done => {
                api
                .delete("/delete/product/100")
                .set('Accept', 'application/json')
                .set("Authorization", devToken)
                .expect('Content-Type', /application\/json/)
                .expect(404, done)
            });
        });
    
        describe("successfully deleted product", () => {
            it("responds status 200", done => {
                api
                .delete("/delete/product/10")
                .set('Accept', 'application/json')
                .set("Authorization", devToken)
                .expect('Content-Type', /application\/json/)
                .expect(200, done)
            });
        });
    });
    
});

/****************** USER QUERIES ******************/

describe("Users Queries", () => {

    describe("Method: GET, Route: users/:id?, obtain all users", ()=>{
        it("responds status 200", done =>{
            api
            .get("/users")
            .set("Accept", "application/json")
            .set("Authorization", devToken)
            .expect("Content-type", /application\/json/)
            .expect(200, done)
        });
    });

    describe("Method: POST, Route: /check-in", () => {
        
        describe("some empty field (names, userName, email, password)", () =>{
            it("responds status 400", done =>{
                api
                .post("/check-in")
                .send(JSON.stringify(userForCheckin1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .expect("Content-type", /application\/json/)
                .expect(400, done)
            });
        });
    
        describe("invalid email", () =>{
            it("responds status 400", done =>{
                api
                .post("/check-in")
                .send(JSON.stringify(userForCheckin3))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .expect("Content-type", /application\/json/)
                .expect(400, done)
            });
        });
    
        describe("successfully checkin", () =>{
            it("responds status 201", done =>{
                api
                .post("/check-in")
                .send(JSON.stringify(userForCheckin))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .expect("Content-type", /application\/json/)
                .expect(201, done)
            });
        });
    });


    describe("Method: POST, Route: /add/user", () => {

        describe("no permissions", () => {
            it("responds status 401", done =>{
                api
                .post("/add/user")
                .send(JSON.stringify(userForCheckin))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(401, done)
            });
        });
    
        describe("some empty field (names, userName, email, password, role)", () => {
            it("responds status 400", done =>{
                api
                .post("/add/user")
                .send(JSON.stringify(userForCheckin1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", devToken)
                .expect("Content-type", /application\/json/)
                .expect(400, done)
            });
        });
    
        describe("invalid role", () => {
            it("responds status 404", done =>{
                api
                .post("/add/user")
                .send(JSON.stringify(userForCheckin2))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", devToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done)
            });
        });
    
        describe("invalid email", () => {
            it("responds status 400", done =>{
                api
                .post("/add/user")
                .send(JSON.stringify(userForCheckin3))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", devToken)
                .expect("Content-type", /application\/json/)
                .expect(400, done)
            });
        });
    
        describe("username duplicate", () => {
            it("responds status 400", done =>{
                api
                .post("/add/user")
                .send(JSON.stringify(userForCheckin4))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", devToken)
                .expect("Content-type", /application\/json/)
                .expect(400, done)
            });
        });
    
        describe("successfully registered user", () => {
            it("responds status 201", done =>{
                api
                .post("/add/user")
                .send(JSON.stringify(userForCheckin5))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", devToken)
                .expect("Content-type", /application\/json/)
                .expect(201, done)
            });
        });
    });


    describe("Method: POST, Route: /log-in", () => {

        describe("some empty field (userName, password)", () =>{
            it("responds status 401", done =>{
                api
                .post("/log-in")
                .send(JSON.stringify(userForLogin))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .expect("Content-type", /application\/json/)
                .expect(401, done)
            });
        });
    
        describe("userName doesnt exist in db", () =>{
            it("responds status 404", done =>{
                api
                .post("/log-in")
                .send(JSON.stringify(userForLogin1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .expect("Content-type", /application\/json/)
                .expect(404, done)
            });
        });
    
        describe("password doesnt exist in db", () =>{
            it("responds status 401", done =>{
                api
                .post("/log-in")
                .send(JSON.stringify(userForLogin2))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .expect("Content-type", /application\/json/)
                .expect(401, done)
            });
        });
    
        describe("succesful connection", () =>{
            it("responds status 200", done =>{
                api
                .post("/log-in")
                .send(JSON.stringify(userForLogin3))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .expect("Content-type", /application\/json/)
                .expect(200, done)
            });
        });
    });


    describe("Method: PUT, Route: modify/names/:id?", () => {

        describe("it doesnt matter token or id, empty field (names)", () => {
            it("responds status 400", done =>{
                api
                .put("/modify/names")
                .send(JSON.stringify(modifiedNamesForUser))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(400, done)
            });
        });
    
        describe("customer token, invalid id (user doesnt checkin)", () => {
            it("responds status 404", done =>{
                api
                .put("/modify/names")
                .send(JSON.stringify(modifiedNamesForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", newCustomerToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done)
            });
        });
    
        describe("customer token, successfully updated myself", () => {
            it("responds status 201", done =>{
                api
                .put("/modify/names")
                .send(JSON.stringify(modifiedNamesForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(201, done)
            });
        });
    
        describe("admin token, user you wants to update doesnt exist", () => {
            it("responds status 404", done =>{
                api
                .put("/modify/names/100")
                .send(JSON.stringify(modifiedNamesForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done)
            });
        });
    
        describe("admin token, user you wants to update has a higher rank ", () => {
            it("responds status 403", done =>{
                api
                .put("/modify/names/1")
                .send(JSON.stringify(modifiedNamesForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(403, done)
            });
        });
    
        describe("admin token, successfully updated others", () => {
            it("responds status 201", done =>{
                api
                .put("/modify/names/3")
                .send(JSON.stringify(modifiedNamesForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(201, done)
            });
        });
    });


    describe("Method: PUT, Route /modify/user-name/:id?", () =>{

        describe("it doesnt matter token or id, empty field (username)", () => {
            it("responds status 400", done =>{
                api
                .put("/modify/user-name")
                .send(JSON.stringify(modifiedUserNameForUser))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(400, done)
            });
        });
    
        describe("customer token, invalid id (user doesnt checkin)", () => {
            it("responds status 404", done =>{
                api
                .put("/modify/user-name")
                .send(JSON.stringify(modifiedUserNameForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", newCustomerToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done)
            });
        });
    
        describe("customer token, successfully updated myself", () => {
            it("responds status 201", done =>{
                api
                .put("/modify/user-name")
                .send(JSON.stringify(modifiedUserNameForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(201, done)
            });
        });
    
        describe("admin token, user you wants to update doesnt exist", () => {
            it("responds status 404", done =>{
                api
                .put("/modify/user-name/100")
                .send(JSON.stringify(modifiedUserNameForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done)
            });
        });
    
        describe("admin token, user you wants to update has a higher rank ", () => {
            it("responds status 403", done =>{
                api
                .put("/modify/user-name/1")
                .send(JSON.stringify(modifiedUserNameForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(403, done)
            });
        });
    
        describe("admin token, successfully updated others", () => {
            it("responds status 201", done =>{
                api
                .put("/modify/user-name/3")
                .send(JSON.stringify(modifiedUserNameForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(201, done)
            });
        });
    });

    
    describe("Method: PUT, Route: /modify/password/:id?", () => {

        describe("it doesnt matter token or id, empty field (oldPassword, newPassword)", () => {
            it("responds status 400", done =>{
                api
                .put("/modify/password")
                .send(JSON.stringify(modifiedPasswordForUser))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(400, done)
            });
        });
    
        describe("customer token, oldPassword doesnt match with the password in db", () => {
            it("responds status 401", done =>{
                api
                .put("/modify/password")
                .send(JSON.stringify(modifiedPasswordForUser2))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(401, done)
            });
        });
    
        describe("customer token, invalid id (user doesnt checkin)", () => {
            it("responds status 404", done =>{
                api
                .put("/modify/password")
                .send(JSON.stringify(modifiedPasswordForUser2))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", newCustomerToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done)
            });
        });
    
        describe("customer token, successfully updated myself", () => {
            it("responds status 201", done =>{
                api
                .put("/modify/password")
                .send(JSON.stringify(modifiedPasswordForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(201, done)
            });
        });
    
        describe("admin token, user you wants to update doesnt exist", () => {
            it("responds status 404", done =>{
                api
                .put("/modify/password/100")
                .send(JSON.stringify(modifiedPasswordForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done)
            });
        });
    
        describe("admin token, user you wants to update has a higher rank ", () => {
            it("responds status 403", done =>{
                api
                .put("/modify/password/1")
                .send(JSON.stringify(modifiedPasswordForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(403, done)
            });
        });
    
        describe("admin token, successfully updated others", () => {
            it("responds status 201", done =>{
                api
                .put("/modify/password/3")
                .send(JSON.stringify(modifiedPasswordForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(201, done)
            });
        });
    });

    
    describe("Method: PUT, Route: /modify/email/:id?", () => {

        describe("it doesnt matter token or id, empty field (email)", () => {
            it("responds status 400", done =>{
                api
                .put("/modify/email")
                .send(JSON.stringify(modifiedEmailForUser))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(400, done)
            });
        });
    
        describe("customer token, invalid id (user doesnt checkin)", () => {
            it("responds status 404", done =>{
                api
                .put("/modify/email")
                .send(JSON.stringify(modifiedEmailForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", newCustomerToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done)
            });
        });
    
        describe("customer token, successfully updated myself", () => {
            it("responds status 201", done =>{
                api
                .put("/modify/email")
                .send(JSON.stringify(modifiedEmailForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(201, done)
            });
        });
    
        describe("admin token, user you wants to update doesnt exist", () => {
            it("responds status 404", done =>{
                api
                .put("/modify/email/100")
                .send(JSON.stringify(modifiedEmailForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done)
            });
        });
    
        describe("admin token, user you wants to update has a higher rank ", () => {
            it("responds status 403", done =>{
                api
                .put("/modify/email/1")
                .send(JSON.stringify(modifiedEmailForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(403, done)
            });
        });
    
        describe("admin token, successfully updated others", () => {
            it("responds status 201", done =>{
                api
                .put("/modify/email/3")
                .send(JSON.stringify(modifiedEmailForUser1))
                .set("Content-type", "application/json")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(201, done)
            });
        });
    });
});


/****************** SHOPPING-CART QUERIES ******************/

describe("Shopping-cart Queries", () => {

    describe("Method: POST, Route: /shopping-cart/add-product/:id", () => {
        describe("*** token, user add product that doesnt exist", () => {
            it("responds status (404)", done => {
                api
                .post("/shopping-cart/add-product/100")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done);
            });
        });

        describe("*** token, user add product", () => {
            it("responds status (201)", done => {
                api
                .post("/shopping-cart/add-product/5")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(201, done);
            });
        });

        describe("*** token, user add product", () => {
            it("responds status (201)", done => {
                api
                .post("/shopping-cart/add-product/5")
                .set("Accept", "application/json")
                .set("Authorization", devToken)
                .expect("Content-type", /application\/json/)
                .expect(201, done);
            });
        });


        describe("*** token, user adds a product that exist", () => {
            it("responds status (201)", done => {
                api
                .post("/shopping-cart/add-product/5")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(201, done);
            });
        });
    });

    describe("Method: GET, Route: /shopping-cart", () => {

        describe("*** token, user dont exist in database", () => {
            it("responds status (404)", done => {
                api
                .get("/shopping-cart")
                .set("Accept", "application/json")
                .set("Authorization", newCustomerToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done);
            });
        });

        describe("*** token, user has no products in the shopping cart ", () => {
            it("responds status (404)", done => {
                api
                .get("/shopping-cart")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done);
            });
        });

        describe("*** token, user has products in the shopping cart ", () => {
            it("responds status (200)", done => {
                api
                .get("/shopping-cart")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(200, done);
            });
        });

    });

    describe("Method: DELETE, Route: /shopping-cart/delete-product/:id", () => {
        describe("*** token, user delete product that doesnt exist", () => {
            it("responds status (404)", done => {
                api
                .delete("/shopping-cart/delete-product/100")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done);
            });
        });

        describe("*** token, user delete a product that was added several times", () => {
            it("responds status (201)", done => {
                api
                .delete("/shopping-cart/delete-product/5")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(201, done);
            });
        });

        describe("*** token, user delete a unique product", () => {
            it("responds status (200)", done => {
                api
                .delete("/shopping-cart/delete-product/5")
                .set("Accept", "application/json")
                .set("Authorization", customerToken)
                .expect("Content-type", /application\/json/)
                .expect(200, done);
            });
        });
    });

    describe("Method: DELETE, Route: /shopping-cart/purchase", () => {
        describe("*** token, user tries purchase but has not products in the shoppin cart", () => {
            it("responds status (404)", done => {
                api
                .delete("/shopping-cart/purchase")
                .set("Accept", "application/json")
                .set("Authorization", adminToken)
                .expect("Content-type", /application\/json/)
                .expect(404, done);
            });
        });

        describe("*** token, user makes the purchase correctly", () => {
            it("responds status (200)", done => {
                api
                .delete("/shopping-cart/purchase")
                .set("Accept", "application/json")
                .set("Authorization", devToken)
                .expect("Content-type", /application\/json/)
                .expect(200, done);
            });
        });
    });

});
