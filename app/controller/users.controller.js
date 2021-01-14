const db = require("../models/db");
const jwt = require("../services/auth.services");
const User = db.users;
const Student = db.students;


// GET with {user_email}
exports.login = async (req, res) => {
    try {
        const userResponse = await User.findOne({where: {email: req.body.email}});
     
        if(!userResponse) {
            res.status(404);
            res.json({message: "Aucun utilisateur n'existe avec cet email"});
            return;
        }

        if (req.body.password == userResponse.password) {
            let student = await userResponse.getStudent();
            let token = jwt.signToken(userResponse.id);
            res.json({user : userResponse, student: student, token : token});
        } else {
            res.status(401);
            res.json({message: "Le mot de passe est érroné"});
        }

    } catch (err) {
        res.status(500).send({message: "Error retrieving User with email=" + req.body.email});
    }
}

// GET with {user_email}
exports.register = async (req, res) => {
    try {
        const userResponse = await User.findOne({where: {email: req.body.email}});
     
        if(!userResponse) {
            let result = await User.create(req.body);
            res.json(result);
        } else {
            res.status(409);
            res.json({message: "Cet email est déjà utilisé"});
        }

    } catch (err) {
        res.status(500).send({message: "Error retrieving User with email=" + req.body.email});
    }
}