const db = require("../models/db");
const Lesson = db.lessons;
const User = db.users;
const Teacher = db.teachers;
const Student = db.students;
const jwt = require("../services/auth.services");
const LessonClass = require('../models/lessons');
const { lessons } = require("../models/db");


// GET /lessons
exports.getAll = async (req, res) => {
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
   const id = req.params.id;
   try {
      let result = await Lesson.findOne({where: {id: id}})
      let newResult = new LessonClass(result);
      let token = req.headers['x-access-token']; //récupération du token
      let verifytoken = jwt.verifyToken(token); //vérification de la validité du token
      if(!verifytoken) {
         res.status(200).json(newResult);
      } else {
         let user = await User.findOne({where: {id: verifytoken}});
         let student = await user.getStudent();
         await student.addLesson(result); // = await result.addStudent(student)
         res.status(200).json({message: "Vous êtes inscrit au cours suivant : ", newResult});
      }
   } catch (err) {
      res.status(500).send({message: "Erreur lors de la récupération du cours dont l'id est : " + id});
   }
}

 // POST /lessons with token
 exports.create = async (req, res) => {
   let token = req.headers['x-access-token']; //récupération du token
   let verifytoken = jwt.verifyToken(token); //vérification de la validité du token
   if(!verifytoken) {
      res.status(401).json({message: "Accès interdit"});
   } else {
      const user = await User.findOne({where: {id: verifytoken}});
      if (!req.body && user.dataValues.type != 1) {
         res.status(400).send({message: "Tous les champs sont obligatoires!"});
         return;
      }
      try {
         const teacher = await user.getTeacher(); // obtenir le professeur associé au token
         let newLesson = new LessonClass(req.body); // on créé une instance de la class Lesson
         let data = await Lesson.create(newLesson); // on créé un cours dans la base de donnée avec l'objet précédent
         await teacher.addLesson(data); // on associe le cours au professeur
         data.dataValues.is_finished = newLesson.is_finished;
         res.status(200).json(data);
      } catch (err) {
         res.status(500).send({ message: err.message || "Erreur lors de la création du cours."});
      }
   }
}

 // PUT /lessons/:id with token
 exports.update = async (req, res) => {
   let token = req.headers['x-access-token']; //récupération du token
   let verifytoken = jwt.verifyToken(token); //vérification de la validité du token
   if(!verifytoken) {
      res.status(401).json({message: "Accès interdit"});
   } else {
      const id = req.params.id;
      try {
         let data = await Lesson.findByPk(id);
         let userToken = await User.findOne({where: {id: verifytoken}});
         let teacher = await userToken.getTeacher();
         let result = await data.hasTeacher(teacher);
         if (result) {
            await Lesson.update(req.body, {where: {id: id}});
            let newLesson = new LessonClass(req.body);
            newLesson.id = id;
            res.status(200).json({message: "Le cours a été mis à jour.",newLesson});
         } else {
            res.status(401).json({message: "Vous ne disposez pas des droits."});
         }
      } catch (err) {
         res.status(500).send({ message: `Erreur : le cours id:${id} n'existe pas.`});
      }  
   }
}

// DELETE /lessons/:id with token
exports.remove = async (req, res) => {
   let token = req.headers['x-access-token']; //récupération du token
   let verifytoken = jwt.verifyToken(token); //vérification de la validité du token
   if(!verifytoken) {
      res.status(401).json({message: "Accès interdit"});
   } else {
      const id = req.params.id;
      try {
         let data = await Lesson.findByPk(id);
         let userToken = await User.findOne({where: {id: verifytoken}});
         let teacher = await userToken.getTeacher();
         let ship = await data.hasTeacher(teacher);
         if (ship) {
            await Lesson.destroy({where: { id: id }});
            let result = await Lesson.findByPk(id);
            if (result === null) {
               res.status(200).send({ message: "Le cours a été supprimé!"});
            }
         } else {
            res.status(401).json({message: "Vous ne disposez pas des droits."});
         }
      } catch (err) {
         res.status(500).send({message: `Erreur : le cours id:${id} n'existe pas.`});
      }
   }
}