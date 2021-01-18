const db = require("../models/db");
const Lesson = db.lessons;
const User = db.users;
const jwt = require("../services/auth.services");
const LessonClass = require('../models/lessons');
const { lessons } = require("../models/db");


// GET /lessons
exports.getAll = async (req, res) => {
   await jwt.verifyToken(req, res);
   try {
      let result = await Lesson.findAll({raw: true})
      let newResult = result.map(element => new LessonClass(element));
      res.status(200).json(newResult);
   } catch (err) {
      res.status(500).send({message: err.message || "Erreur lors de la récupération des cours."});
   }
};

// GET /lessons/:id           (Si authentifié en tant qu'étudiant alors je m'inscris au cours)
exports.getById = async (req, res) => {
   let userId = await jwt.verifyToken(req, res);
   try {
      let result = await Lesson.findOne({where: {id: req.params.id}})
      let newResult = new LessonClass(result);
      let user = await User.findOne({where: {id: userId}});
      if (user.dataValues.type == 2) { // Type 2 pour étudiant
         let student = await user.getStudent();
         await student.addLesson(result); // = await result.addStudent(student)
         res.status(200).json({message: "Vous pouvez vous inscrire au cours suivant : ", newResult});
      } else {
         res.status(200).json(newResult);
      }   
   } catch (err) {
      res.status(500).send({ message: `Erreur : le cours ${req.params.id} n'existe pas.`});
   }
}

 // POST /lessons with token
 exports.create = async (req, res) => {
   let userId = await jwt.verifyToken(req, res);
   try {
      const user = await User.findOne({where: {id: userId}});
      if (user.dataValues.type != 1) {
         res.status(400).send({message: "Vous ne disposez pas des droits!"});
         return;
      } else {
         const teacher = await user.getTeacher(); // obtenir le professeur associé au token
         let newLesson = new LessonClass(req.body); // on créé une instance de la class Lesson
         let data = await Lesson.create(newLesson); // on créé un cours dans la base de donnée avec l'objet précédent
         await teacher.addLesson(data); // on associe le cours au professeur
         data.dataValues.is_finished = newLesson.is_finished;
         res.status(200).json(data);
      }
   } catch (err) {
      res.status(500).send({ message: err.message || "Erreur lors de la création du cours."});
   }
}

 // PUT /lessons/:id with token
 exports.update = async (req, res) => {
   let userId = await jwt.verifyToken(req, res);
   try {
      let data = await Lesson.findByPk(req.params.id);
      let userToken = await User.findOne({where: {id: userId}});
      let teacher = await userToken.getTeacher();
      let result = await data.hasTeacher(teacher);
      if (result) {
         await Lesson.update(req.body, {where: {id: req.params.id}});
         let newLesson = new LessonClass(req.body);
         newLesson.id = req.params.id;
         res.status(200).json({message: "Le cours a été mis à jour.",newLesson});
      } else {
         res.status(401).json({message: "Vous ne disposez pas des droits."});
      }
   } catch (err) {
      res.status(500).send({ message: `Erreur : le cours ${req.params.id} n'existe pas.`});
   }  
}

// DELETE /lessons/:id with token
exports.remove = async (req, res) => {
   let userId = await jwt.verifyToken(req, res);
   try {
      let data = await Lesson.findByPk(req.params.id);
      let userToken = await User.findOne({where: {id: userId}});
      let teacher = await userToken.getTeacher();
      let ship = await data.hasTeacher(teacher);
      if (ship) {
         await Lesson.destroy({where: { id: req.params.id }});
         let result = await Lesson.findByPk(req.params.id);
         if (result === null) {
            res.status(200).send({ message: "Le cours a été supprimé!"});
         }
      } else {
         res.status(401).json({message: "Vous ne disposez pas des droits."});
      }
   } catch (err) {
      res.status(500).send({message: `Erreur : le cours ${req.params.id} n'existe pas.`});
   }
}