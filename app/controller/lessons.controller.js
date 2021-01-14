const db = require("../models/db");
const Lesson = db.lessons;
const services = require("../services/lessons.services");

// https://sequelize.org/master/manual/model-querying-basics.html#simple-select-queries

// GET
exports.getAll = async (req, res) => {
   try {
      let data = await Lesson.findAll();
      data = services(data);
      res.json(data);
   } catch (err) {
      res.status(500).send({message: err.message || "Some error occurred while retrieving lessons."});
   }
};

// GET with {lesson_id}
exports.getById = async (req, res) => {
   const id = req.params.id;
   try {
      let data = await Lesson.findByPk(id);
      data = services(data);
      res.json(data);
   } catch (err) {
      res.status(500).send({message: "Error retrieving Lesson with id=" + id});
   }
}

 // POST
 exports.create = async (req, res) => {
   if (!req.body.title) {
      res.status(400).send({message: "Content can not be empty!"});
      return;
   }
   try {
      const lesson = {
         title: req.body.title,
         hours: req.body.hours,
         description: req.body.description,
         teacher: req.body.teacher,
         file_name: req.body.file_name,
         starting_date: req.body.starting_date,
         ending_date: req.body.ending_date
      };
      console.log(lesson);
      let data = await Lesson.create(lesson);
      data = services(data);
      res.json(data);
   } catch (err) {
      res.status(500).send({ message: err.message || "Some error occurred while creating the Lesson."});
   }
}

 // PUT with  {lesson_id}
 exports.update = async (req, res) => {
   const id = req.params.id;
   try {
      let data = await Lesson.update(req.body, {where: {id: id}});
      if (data.length == 1) {
         let data = await Lesson.findByPk(id);
         data = services(data);
         res.json({message: "Lesson was updated successfully.",data});
      } else {
         res.send({message: `Cannot update Lesson with id=${id}. Maybe Lesson was not found or req.body is empty!`});
      }
   } catch (err) {
      res.status(500).send({ message: "Error updating Lesson with id=" + id});
   }  
}

// DELETE with  {lesson_id}
exports.remove = async (req, res) => {
   const id = req.params.id;
   try {
      await Lesson.destroy({where: { id: id }});
      let data = await Lesson.findByPk(id);
      if (data === null) {
         res.send({ message: "Lesson was deleted successfully!"});
       } else {
         res.send({message: `Cannot delete Lesson with id=${id}. Maybe Lesson was not found!`});
       }
   } catch (err) {
      res.status(500).send({message: "Could not delete Lesson with id=" + id});
   }
}