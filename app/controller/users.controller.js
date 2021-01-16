const db = require("../models/db");
const jwt = require("../services/auth.services");
const User = db.users;
const Student = db.students;
const Teacher = db.teachers;
const TeacherClass = require('../models/teacher');
const StudentClass = require('../models/student');
const UserClass = require('../models/user');

// POST /auth/login  req.body.email + req.body.password = token.id
exports.login = async (req, res) => {
    try {
        const userResponse = await User.findOne({where: {email: req.body.email}});
     
        if(!userResponse) {
            res.status(404);
            res.json({message: "Aucun utilisateur n'existe avec cet email"});
            return;
        }

        if (req.body.password == userResponse.password) {
            let student = await userResponse.getStudent(); //dans db.js: db.users.belongsTo(db.students) permet user.getStudent
            let teacher = await userResponse.getTeacher(); //dans db.js: db.users.belongsTo(db.teachers) permet user.getTeacher
            let token = jwt.signToken(userResponse.id);
            res.json({user : userResponse, student: student, teacher: teacher,token : token});
        } else {
            res.status(401);
            res.json({message: "Le mot de passe est érroné"});
        }

    } catch (err) {
        res.status(500).send({message: "Erreur lors de la récupération de l'utilisateur avec email : " + req.body.email});
    }
}

// POST /auth/register 
exports.register = async (req, res) => {
    try {
        const userResponse = await User.findOne({where: {email: req.body.email}});    
        if(!userResponse) {
            // type = 1 pour teacher , 2 pour student, 3 pour utilisateur
            if(req.body.type == 1 && Object.keys(req.body).length == 8) {
                let newTeacher = new TeacherClass(req.body);
                let result = await Teacher.create(newTeacher, {include: [ User ]}); 
                res.status(200).json(result);
            } else if (req.body.type == 2 && Object.keys(req.body).length == 9) {
                let newStudent = new StudentClass(req.body);
                let result = await Student.create(newStudent, {include: [ User ]});
                res.status(200).json({result, age:newStudent.age});
            } else if (req.body.type == 3 && req.body.password) {
                let newUser = new UserClass(req.body);
                let result = await User.create(newUser);
                res.status(200).json(result);
            } else {
                res.status(409).json({message: "Tous les champs sont obligatoires"});
            }
        } else {
            res.status(409).json({message: "Cet email est déjà utilisé"});
        }
    } catch (err) {
        res.status(500).send({message: "Erreur lors de la récupération de l'utilisateur avec email : " + req.body.email});
    }
}

