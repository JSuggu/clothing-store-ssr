const jwt = require("jsonwebtoken");
const getKey = require("./get-users-keys");
const getToken = require("./get-token");

//Mensaje para cuando el token de autorizacion no es correcto.
const message = "El token ingresado no es valido o ha expirado, inicie sesion nuevamente para obtener un nuevo token"; 

const verification = {

    developer: function(req, res, next){
        const token = getToken(req);

        if(!token)
            return res.status(401).send({message: message})

        jwt.verify(token, getKey("developer"), (err, decoded) => {
            if(err)
                return res.status(401).send({message: message});
            
            req.decoded = decoded;
            next();
        });

    },

    admin: function (req, res, next){
        const token = getToken(req);

        if(!token)
            return res.status(401).send({message: message})

        jwt.verify(token, getKey("admin"), (err, decoded) => {
            if(err)
                return verification.developer(req, res, next);
            
            req.decoded = decoded;
            next();
        });
    },

    customer: function(req, res, next){
        const token = getToken(req);

        if(!token)
            return res.status(401).send({message: message})

        jwt.verify(token, getKey("customer"), (err, decoded) => {
            if(err)
                return verification.admin(req, res, next);

            req.decoded = decoded;
            next();
        });
    }

}

module.exports = verification;