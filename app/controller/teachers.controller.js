const db = require("../models/db");
const jwt = require("../services/auth.services");
const Teacher = db.teachers;

// GET /teachers avec token
exports.getAll = async (req, res) => {
   let token = req.headers['x-access-token']; //récupération du token
   let verifytoken = jwt.verifyToken(token); //vérification de la validité du token
   if(!verifytoken) {
      res.status(401).json({message: "Accès interdit"});
   } else {
      try {
         let data = await Teacher.findAll({raw: true})
         res.status(200).json(data);
      } catch (err) {
         res.status(500).send({message: err.message || "Une erreur s'est produite lors de la récupération du professeur."});
      }
   }
};

// GET /teachers/id avec token
exports.getById = async (req, res) => {
   let token = req.headers['x-access-token']; //récupération du token
   let verifytoken = jwt.verifyToken(token); //vérification de la validité du token
   if(!verifytoken) {
      res.status(401).json({message: "Accès interdit"});
   } else {
      try {
         const TeacherResponse = await Teacher.findOne({where: {id: req.params.id}});
         if(!TeacherResponse) {
            res.status(404).json({message: "Aucun utilisateur n'existe avec cet identifiant"});
            //return;
         } else {
            res.status(200).json(TeacherResponse);
         }
      } catch (err) {
         res.status(500).send({message: "Erreur lors de la récupération du professeur dont l'id est : " + req.params.id});
      }
   }
}