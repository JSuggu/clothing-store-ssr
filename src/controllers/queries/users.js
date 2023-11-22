const bcrypt = require("bcryptjs");
const Users = require("../../models/Users"); 
const UsersRole = require("../../models/UsersRoles"); 


//Conjunto que uso para verificar en los condicionales si se ingreso algun tipo de dato que no es valido
const invalidData = new Set([undefined, null, NaN, ""]);

const queries = {
    roles: async function(req, res){
        const allRoles = await UsersRole.findAll();
        return res.status(200).send({allRoles});
    },

    addRole: async function(req, res){
        const name = req.body.name;

        if(invalidData.has(name))
            return res.status(400).send({message: "El rol debe tener un nombre"});

        const newRol = await UsersRole.create({
            name: name
        }).catch(err =>{
            return err;
        });

        if(newRol.name == "SequelizeValidationError")
            return res.status(400).send({error: newRol.errors, message: "El rol no puedo añadirse"});

        return res.status(201).send({newRol, message: "Nuevo rol creado"})
    },

    users: async function(req, res){
        const allUsers = await Users.findAll({
            include: {
                model: UsersRole,
                attributes: ["role_name", "priority"]
            },
            attributes: ["id", "names", "user_name", "email", "password"]
        });

        return res.status(200).send({allUsers});
    },

    //consulta para que el admin o desarrollador agregue un nuevo usuario
    addUser: async function (req, res){
        const {names, userName, email, password} = req.body;
        let role = req.body.role;

        if(invalidData.has(names) || invalidData.has(userName) || invalidData.has(email) || invalidData.has(password) || invalidData.has(role))
            return res.status(400).send({message: "Los valores no pueden ser nulos"});
        
        const encryptedPassword = await bcrypt.hash(password, 8);

        role = await UsersRole.findOne({
            where: {
                name: role
            }
        });

        if(invalidData.has(role))
            return res.status(404).send({message:"El Usuario no pudo agregarse porque el rol que intento asignarsele no existe"});

        const newUser = await Users.create({
            names: names,
            user_name: userName,
            email: email,
            password: encryptedPassword,
            role_id: role.id
        }).catch(err =>{
            return err;
        });
        console.log(newUser)
        if(newUser.name == "SequelizeValidationError" || newUser.name == "SequelizeUniqueConstraintError")
            return res.status(400).send({error: newUser.errors, message: "El usuario no puedo registrarse"});
        
        return res.status(201).send({newUser, message:"Usuario agregado correctamente"});
    },

    //consulta para cuando el usuario se registra
    registerUser: async function(req, res){
        const {names, userName, email, password} = req.body;

        const encryptedPassword = await bcrypt.hash(password, 8);

        if(invalidData.has(names) || invalidData.has(userName) || invalidData.has(email) || invalidData.has(password))
            return res.status(400).send({message: "Los valores no pueden ser nulos"});

        const role = (await UsersRole.findOne({
            where: {
                name: "customer"
            }
        })).id;

        const newUser = await Users.create({
            names: names,
            user_name: userName,
            email: email,
            password: encryptedPassword,
            role_id: role
        }).catch(err =>{
            return err;
        });

        if(newUser.name == "SequelizeValidationError")
            return res.status(400).send({error: newUser.errors, message: "El usuario no puedo registrarse"});
        
        return res.status(201).send({newUser, message:"Usuario agregado correctamente"});
    },

    login: async function(req, res){
        let authorized = req.session.authorized;
        
        if(req.session.user)
            return res.redirect("user", {authorized});

        const {username, password} = req.body;

        if(invalidData.has(username) || invalidData.has(password))
            return res.status(401).render("login", {message:"El usuario o la contraseña son incorrectos", authorized});

        const user = await Users.findOne({
            include: {
                model: UsersRole,
                attributes: ["role_name", "priority"]
            },
            where: {
                user_name: username,
            },
            attributes: ["id", "names", "user_name", "email", "password"]
        });

        if(invalidData.has(user))
            return res.status(404).render("login", {message:"El usuario o la contraseña son incorrectos", authorized});

        if(!await bcrypt.compare(password, user.password))
            return res.status(401).render("login", {message: "El usuario o la contraseña son incorrectos", authorized});

        req.session.user = user.user_name;
        req.session.authorized = "true";
        authorized = req.session.authorized;

        return res.status(200).render("user", {user: user, message:"Logueado correctamente", authorized});
    },

    //consultas para hacer modificaciones a los datos del usuario
    modifyNames: async function(req, res){
        const token = req.decoded;
        const names = req.body.names;
        const id = req.params.id;

        if(invalidData.has(names))
            return res.status(400).send({message: "Debe ingresar algun nombre"});
        
        if(invalidData.has(id)){
            const userId = token.id;
            const userUpdated = await Users.update({names: names}, {
                where: {
                    id: userId
                }
            }).catch(err =>{
                return err;
            });

            if(userUpdated == 0)
                return res.status(404).send({message: "El usuario que intento modifcar no existe y no se ha producido ningun cambio"});

            if(userUpdated.name == "SequelizeValidationError")
                return res.status(400).send({error: userUpdated.errors, message: "El nombre no puedo actualizarse"});

            return res.status(201).send({userUpdated, message:"Nombres actualizados correctamente"});
        }

        const tokenRole = token.users_role;

        //consulta a la base de datos para obtener el rol del usuario que quiero modificar,
        //esto es para que los admin no puedan modificar los datos de otros admin o de los dev.
        const userToModify = await Users.findOne({
            include: {
                model: UsersRole,
                attributes: ["role_name", "priority"]
            },
            where: {
                id: id
            }
        });

        if(invalidData.has(userToModify))
            return res.status(404).send({message:"El usuario que esta intentando modificar no existe"});

        if(tokenRole.priority > userToModify.users_role.priority)
            return res.status(403).send({message:"No tiene autorizacion para modificar datos de otros usuarios"});
            
        const userUpdated = await Users.update({names: names}, {
            where: {
                id: id
            }
        }).catch(err =>{
            return err;
        });

        if(userUpdated == 0)
            return res.status(404).send({message: "El usuario que intento modifcar no existe y no se ha producido ningun cambio"});

        if(userUpdated.name == "SequelizeValidationError")
            return res.status(400).send({error: userUpdated.errors, message: "El nombre no puedo actualizarse"});

        return res.status(201).send({userUpdated, message:"Nombres actualizado actualizado correctamente"});
    },

    //Modificar nombre de usuario
    modifyUserName: async function(req, res){
        const token = req.decoded;
        const userName = req.body.userName;
        const id = req.params.id;

        if(invalidData.has(userName))
            return res.status(400).send({message: "Debe ingresar algun nombre"});
        
        if(invalidData.has(id)){
            const userId = token.id;
            const userUpdated = await Users.update({user_name: userName}, {
                where: {
                    id: userId
                }
            }).catch(err =>{
                return err;
            });

            if(userUpdated == 0)
            return res.status(404).send({message: "El usuario que intento modifcar no existe y no se ha producido ningun cambio"});

            if(userUpdated.name == "SequelizeValidationError")
                return res.status(400).send({error: userUpdated.errors, message: "El nombre de usuario no puedo actualizarse"});

            return res.status(201).send({userUpdated, message:"Nombre de usuario actualizado actualizado correctamente"});
        }

        const tokenRole = token.users_role;

        //consulta a la base de datos para obtener el rol del usuario que quiero modificar,
        //esto es para que los admin no puedan modificar los datos de otros admin o de los dev.
        const userToModify = await Users.findOne({
            include: {
                model: UsersRole,
                attributes: ["role_name", "priority"]
            },
            where: {
                id: id
            }
        });

        if(invalidData.has(userToModify))
            return res.status(404).send({message:"El usuario que esta intentando modificar no existe"});

        if(tokenRole.priority > userToModify.users_role.priority)
            return res.status(403).send({message:"No tiene autorizacion para modificar datos de otros usuarios"});
            
        const userUpdated = await Users.update({user_name: userName}, {
            where: {
                id: id
            }
        }).catch(err =>{
            return err;
        });

        if(userUpdated == 0)
            return res.status(404).send({message: "El usuario que intento modifcar no existe y no se ha producido ningun cambio"});

        if(userUpdated.name == "SequelizeValidationError")
            return res.status(400).send({error: userUpdated.errors, message: "El nombre de usuario no puedo actualizarse"});

        return res.status(201).send({userUpdated, message:"Nombre de usuario actualizado correctamente"});
    },

    modifyPassword: async function(req, res){
        const token = req.decoded;
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const id = req.params.id;

        if(invalidData.has(oldPassword) || invalidData.has(newPassword))
            return res.status(400).send({message: "Debe ingresar su contraseña actual y la nueva contraseña"});
        
        //Esta validacion solo sirve cuando un cliente esta intentado cambiar su contraseña,
        //ya que cuando lo quiere hacer un admin o un dev siempre resulta en falso y nuncan se ejecuta el return
        if(token.users_role.name == "customer" && !await bcrypt.compare(oldPassword, token.password))
            return res.status(401).send({message:"Su contraseña actual no coincide con la que se encuentra en la base de datos"});
        
        if(invalidData.has(id)){
            const userId = token.id;
            const password = await bcrypt.hash(newPassword, 8);
            const userUpdated = await Users.update({password: password}, {
                where: {
                    id: userId
                }
            }).catch(err =>{
                return err;
            });

            if(userUpdated == 0)
            return res.status(404).send({message: "El usuario que intento modifcar no existe y no se ha producido ningun cambio"});

            if(userUpdated.name == "SequelizeValidationError")
                return res.status(400).send({error: userUpdated.errors, message: "La contraseña no puedo actualizarse"});

            return res.status(201).send({userUpdated, message:"Contraseña actualizada correctamente"});
        }

        const tokenRole = token.users_role;

        //consulta a la base de datos para obtener el rol del usuario que quiero modificar,
        //esto es para que los admin no puedan modificar los datos de otros admin o de los dev.
        const userToModify = await Users.findOne({
            include: {
                model: UsersRole,
                attributes: ["role_name", "priority"]
            },
            where: {
                id: id
            }
        });

        if(invalidData.has(userToModify))
            return res.status(404).send({message:"El usuario que esta intentando modificar no existe"});

        if(tokenRole.priority > userToModify.users_role.priority)
            return res.status(403).send({message:"No tiene autorizacion para modificar datos de otros usuarios"});
            
        const password = await bcrypt.hash(newPassword, 8);
        const userUpdated = await Users.update({password: password}, {
        where: {
                id: id
            }
        }).catch(err =>{
            return err;
        });

        if(userUpdated == 0)
            return res.status(404).send({message: "El usuario que intento modifcar no existe y no se ha producido ningun cambio"});

        if(userUpdated.name == "SequelizeValidationError")
            return res.status(400).send({error: userUpdated.errors, message: "La contraseña no puedo actualizarse"});

        return res.status(201).send({userUpdated, message:"Contraseña actualizada correctamente"});
    },

    //Modificar email del usuario
    modifyEmail: async function(req, res){
        const token = req.decoded;
        const email = req.body.email;
        const id = req.params.id;

        if(invalidData.has(email))
            return res.status(400).send({message: "Debe ingresar algun email"});
        
        if(invalidData.has(id)){
            const userId = token.id;
            const userUpdated = await Users.update({email: email}, {
                where: {
                    id: userId
                }
            }).catch(err =>{
                return err;
            });

            if(userUpdated == 0)
            return res.status(404).send({message: "El usuario que intento modifcar no existe y no se ha producido ningun cambio"});

            if(userUpdated.name == "SequelizeValidationError")
                return res.status(400).send({error: userUpdated.errors, message: "El email no puedo actualizarse"});

            return res.status(201).send({userUpdated, message:"Email actualizado actualizado correctamente"});
        }

        const tokenRole = token.users_role;

        //consulta a la base de datos para obtener el rol del usuario que quiero modificar,
        //esto es para que los admin no puedan modificar los datos de otros admin o de los dev.
        const userToModify = await Users.findOne({
            include: {
                model: UsersRole,
                attributes: ["role_name", "priority"]
            },
            where: {
                id: id
            }
        });

        if(invalidData.has(userToModify))
            return res.status(404).send({message:"El usuario que esta intentando modificar no existe"});

        if(tokenRole.priority > userToModify.users_role.priority)
            return res.status(403).send({message:"No tiene autorizacion para modificar datos de otros usuarios"});
            
        const userUpdated = await Users.update({email: email}, {
            where: {
                id: id
            }
        }).catch(err =>{
            return err;
        });

        if(userUpdated == 0)
            return res.status(404).send({message: "El usuario que intento modifcar no existe y no se ha producido ningun cambio"});

        if(userUpdated.name == "SequelizeValidationError")
            return res.status(400).send({error: userUpdated.errors, message: "El email no puedo actualizarse"});

       return res.status(201).send({userUpdated, message:"Email actualizado correctamente"});    
    },

    deleteUser: async function(req, res){
        const token = req.decoded;
        const id = req.params.id;

        if(invalidData.has(id)){
            const userDeleted = await Users.destroy({
                where: {
                    id: token.id
                }
            }); 
            return res.status(200).send({userDeleted, message: "Usuario eliminado"});
        }

        const roleToken = token.users_role;

        const userToDelete = await Users.findOne({
            include: {
                model: UsersRole,
                attributes: ["role_name", "priority"]
            },
            where: {
                id:id
            }
        });

        if(invalidData.has(userToDelete))
            return res.status(400).send({message: "El usuario que esta intentando eliminar no existe"});

        if(roleToken.priority > userToDelete.users_role.priority)
            return res.status(403).send({message: "No tiene los permisos necesarios para modificar este usuario"});

        const userDeleted = await Users.destroy({
            where: {
                id: id
            }
        });

        return res.status(200).send({userDeleted, message: "Usuario eliminado"});
    }
}

module.exports = queries;