const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");

// génére le token
exports.signToken = (id) => {
    let token = jwt.sign({ id: id }, config.secret, { expiresIn: 864000 }); //1h:3600 24h:86400
    console.log(token);
    return token;
}

// verifie le token SI valide ALORS renvoie le userId SINON renvoie un message d'erreur 
exports.verifyToken = async (req, res) => {
    let token = req.headers['x-access-token'];
    console.log('verify '+token);
    if (!token) {
        res.status(401)
        res.json({ "message":"Unauthorized"})
        return;
    }
    try {
        let response = await jwt.verify(token, config.secret);
        return response.id;
    } catch (e) {
        res.status(403)
        res.json({ "message": " Forbidden" })
        return;
    }

}


