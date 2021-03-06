const db = require("../models/db");
const jwt = require("../services/auth.services");
const Teacher = db.teachers;

// GET /teachers avec token
exports.getAll = async (req, res) => {
   await jwt.verifyToken(req, res);
   try {
      let data = await Teacher.findAll();
      res.status(200).json(data);
   } catch (err) {
      res.status(500).send({message: err.message || "Une erreur s'est produite lors de la récupération des professeurs."});
   }
};

// GET /teachers/id avec token
exports.getById = async (req, res) => {
   await jwt.verifyToken(req, res);
   try {
      const TeacherResponse = await Teacher.findOne({where: {id: req.params.id}});
      if(!TeacherResponse) {
         res.status(404).json({message: "Aucun Professeur n'existe avec cet identifiant"});
      } else {
         res.status(200).json(TeacherResponse);
      }
   } catch (err) {
      res.status(500).send({message: "Erreur lors de la récupération du professeur dont l'id est : " + req.params.id});
   }
}