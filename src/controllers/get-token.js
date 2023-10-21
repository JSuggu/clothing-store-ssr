const getToken = function (req){
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if(!token)
        return false;
    
    if(token.startsWith("Bearer "))
        token = token.slice(7, token.length);
    
    return token;
}

module.exports = getToken;