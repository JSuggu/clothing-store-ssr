const getKey = require("../src/controllers/get-users-keys");
const getToken = require("../src/controllers/get-token");

const req = {
    headers: {
        authorization: "Bearer dsax65sa7dw81ad3as85"
    }
}
const req2 = {
    headers: {
       
    }
}

test("define getKey() => undefined", () => {
    const result = getKey("usuario");
    expect(result).toBeUndefined();
})

test("define getKey() => string", () => {
    const result = getKey("developer");
    expect(typeof result).toBe("string");
})

test("define getToken() => false", () =>{
    const result = getToken(req2);
    expect(result).toBeFalsy();
});

test("define getToken() => string", () =>{
    const result = getToken(req);
    expect(typeof result).toBe("string");
});
