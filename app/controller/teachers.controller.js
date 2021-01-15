const { response } = require("express");
const db = require("../models/db");
const jwt = require("../services/auth.services");
const Teacher = db.teachers;

// https://sequelize.org/master/manual/model-querying-basics.html#simple-select-queries

// GET /teachers
exports.getAll = async (req, res) => {
   //récupération du token
   let token = req.headers['x-access-token'];
   console.log("dans teachers.controller.js, méthode getAll, req.headers['x-access-token'] : ", token);
   //vérification de la validité du token
   let verifytoken = jwt.verifyToken(token);
   console.log("dans teachers.controller.js, méthode getAll, jwt.verifyToken(req.headers['x-access-token']) : ",verifytoken);
   if(!verifytoken) {
      //si token n'est pas valide : utilisateur non authentifié
      res.status(401);
      res.json({message: "Accès interdit"});
   } else {
      try {
         let data = await Teacher.findAll({raw: true})
         res.json(data);
      } catch (err) {
         res.status(500).send({message: err.message || "Some error occurred while retrieving teacher."});
      }
   }
};

// GET /teachers/id
exports.getById = async (req, res) => {
   const id = req.params.id;
   try {
      let data = await Teacher.findByPk(id, {raw: true});
      res.json(data);
   } catch (err) {
      res.status(500).send({message: "Error retrieving Teacher with id=" + id});
   }
}