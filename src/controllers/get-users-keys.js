//Admin puede hacer cambios en las bases de datos, eliminar, crear registros, etc.
//Common es para los clientes.
const keys = new Map() 
keys.set("developer", "developer123");
keys.set("admin", "admin123");
keys.set("customer", "customer123");

const getKey = function(rol){
    return keys.get(rol);
}

module.exports = getKey;