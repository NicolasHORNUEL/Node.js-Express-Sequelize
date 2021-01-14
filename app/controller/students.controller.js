const { response } = require("express");
const db = require("../models/db");
const jwt = require("../services/auth.services");
const Student = db.students;
const Lesson = db.lessons;
const services = require("../services/students.services");

// https://sequelize.org/master/manual/model-querying-basics.html#simple-select-queries

// GET
exports.getAll = async (req, res) => {
   //récupération du token
   let token = req.headers['x-access-token'];
   console.log("dans students.controller.js, méthode getAll, req.headers['x-access-token'] : ", token);
   //vérification de la validité du token
   let verifytoken = jwt.verifyToken(token);
   console.log("dans students.controller.js, méthode getAll, jwt.verifyToken(req.headers['x-access-token']) : ",verifytoken);
   if(!verifytoken) {
      //si token n'est pas valide : utilisateur non authentifié
      res.status(401);
      res.json({message: "Accès interdit"});
   } else {
      try {
         //let data = await Student.findAll();
         let data = await Student.findAll({raw: true})
         data = services(data);
         res.json(data);
      } catch (err) {
         res.status(500).send({message: err.message || "Some error occurred while retrieving students."});
      }
   }
};

// GET with {student_id}
exports.getById = async (req, res) => {
   const id = req.params.id;
   try {
      let data = await Student.findByPk(id, {raw: true});
      data = services(data);
      res.json(data);
   } catch (err) {
      res.status(500).send({message: "Error retrieving Student with id=" + id});
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

 // POST
 exports.create = async (req, res) => {
   if (!req.body) {
      res.status(400).send({message: "Content can not be empty!"});
      return;
   }
   try {
      const student = {
         first_name: req.body.first_name,
         last_name: req.body.last_name,
         birthdate: req.body.birthdate,
         bio: req.body.bio,
         class: req.body.class
      };
      let data = await Student.create(student, {raw: true});
      data = services(data);
      res.json(data);
   } catch (err) {
      res.status(500).send({ message: err.message || "Some error occurred while creating the Student."});
   }
}

 // PUT with  {student_id}
 exports.update = async (req, res) => {
   const id = req.params.id;
   try {
      let data = await Student.update(req.body, {where: {id: id}, raw: true});
      if (data.length == 1) {
         let data = await Student.findByPk(id, {raw: true});
         data = services(data);
         res.json({message: "Student was updated successfully.",data});
      } else {
         res.send({message: `Cannot update Student with id=${id}. Maybe Student was not found or req.body is empty!`});
      }
   } catch (err) {
      res.status(500).send({ message: "Error updating Student with id=" + id});
   }  
}

// DELETE with  {student_id}
exports.remove = async (req, res) => {
   const id = req.params.id;
   try {
      await Student.destroy({where: { id: id }, raw: true});
      let data = await Student.findByPk(id);
      if (data === null) {
         res.send({ message: "Student was deleted successfully!"});
       } else {
         res.send({message: `Cannot delete Student with id=${id}. Maybe Student was not found!`});
       }
   } catch (err) {
      res.status(500).send({message: "Could not delete Student with id=" + id});
   }
}