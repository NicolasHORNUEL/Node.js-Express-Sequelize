const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");

// vérifie si le token est validé
exports.verifyToken = (token) => {
    if(!token) {
        return false;
    }
    return jwt.verify(token, config.secret, (err, response) => {
        if(err) {
            return false;
        }
        return response.id; //return true;
    })
}

// génére le token
exports.signToken = (id) => {
    let token = jwt.sign({ id: id }, config.secret, { expiresIn: 86400 }); //1h:3600 24h:86400
    return token;
}