const db = require("../models/db");
const jwt = require("../services/auth.services");
const Student = db.students;
const Lesson = db.lessons;
const StudentClass = require('../models/student');

// GET /students avec token
exports.getAll = async (req, res) => {
   let token = req.headers['x-access-token']; //récupération du token
   let verifytoken = jwt.verifyToken(token); //vérification de la validité du token
   if(!verifytoken) {
      res.status(401).json({message: "Accès interdit"});
   } else {
      try {
         let result = await Student.findAll({raw: true})
         let newResult = result.map(element => new StudentClass(element));
         res.status(200).json(newResult);
      } catch (err) {
         res.status(500).send({message: err.message || "Une erreur s'est produite lors de la récupération des étudiants."});
      }
   }
};

// GET /students/:id avec token
exports.getById = async (req, res) => {
   let token = req.headers['x-access-token']; //récupération du token
   let verifytoken = jwt.verifyToken(token); //vérification de la validité du token
   if(!verifytoken) {
      res.status(401).json({message: "Accès interdit"});
   } else {
      try {
         const StudentResponse = await Student.findOne({where: {id: req.params.id}});
         if(!StudentResponse) {
            res.status(404).json({message: "Aucun utilisateur n'existe avec cet identifiant"});
            //return;
         } else {
            let newStudent = new StudentClass(StudentResponse);
            res.status(200).json({StudentResponse, age:newStudent.age});
         }
      } catch (err) {
         res.status(500).send({message: "Erreur lors de la récupération de l'étudiant dont l'id est : " + req.params.id});
      }
   }
}

// GET /students/add-friend/:id1/:id2
exports.addFriend = async (req, res) => {
   let token = req.headers['x-access-token']; //récupération du token
   let verifytoken = jwt.verifyToken(token); //vérification de la validité du token
   if(!verifytoken) {
      res.status(401).json({message: "Accès interdit"});
   } else {
      try {
         let student1 = await Student.findByPk(req.params.id1);
         let student2 = await Student.findByPk(req.params.id2);
         if (student1 != undefined && student2 != undefined)  { 
            let result = await student1.hasFriend(student2); // on vérifie l'association
            if (!result) {
               await student1.setFriend(student2);
               await student2.setFriend(student1);
               res.status(200).json({message: "Relation Ajoutée"});
            } else {
               res.json({message: "Relation Existante"});
            }
         } else {
            res.status(500).send({message: "Identifiants inconnus"});
         }
      } catch (err) {
         res.status(500).send({message: "Erreur serveur"});
      }
   }
}

// GET /students/remove-friend/:id1/:id2
exports.removeFriend = async (req, res) => {
   let token = req.headers['x-access-token']; //récupération du token
   let verifytoken = jwt.verifyToken(token); //vérification de la validité du token
   if(!verifytoken) {
      res.status(401).json({message: "Accès interdit"});
   } else {
      try {
         let student1 = await Student.findByPk(req.params.id1);
         let student2 = await Student.findByPk(req.params.id2);
         if (student1 != undefined && student2 != undefined)  { 
            let result = await student1.hasFriend(student2); // on vérifie l'association
            if (result) {
               await student1.removeFriend(student2);
               await student2.removeFriend(student1);
               res.status(200).json({message: "Relation Supprimée"});
            } else {
               res.json({message: "Relation Inexistante"});
            }
         } else {
            res.status(500).send({message: "Identifiants inconnus"});
         }
      } catch (err) {
         res.status(500).send({message: "Erreur serveur"});
      }
   }
}

// GET with {add-student-to-lesson/:id1/:id2}
exports.addLesson = async (req, res) => {
   try {
      let student = await Student.findByPk(req.params.id2);
      let lesson = await Lesson.findByPk(req.params.id1);
      await lesson.setStudents(student);
      //res.json("relation ajoutée");
      let lessons = await student.getLessons();
      res.json(lessons);

   } catch (err) {
      res.status(500).send({message: err});
   }
}