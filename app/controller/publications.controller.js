const db = require("../models/db");
const User = db.users;
const Publication = db.publications;
const Teacher = db.teachers;
const Student = db.students;
const Lesson = db.lessons;
const jwt = require("../services/auth.services");

 // POST /publications with token
 exports.create = async (req, res) => {
   let token = req.headers['x-access-token']; //récupération du token
   let verifytoken = jwt.verifyToken(token); //vérification de la validité du token
   if(!verifytoken) {
      res.status(401).json({message: "Accès interdit"});
   } else {
      const user = await User.findOne({where: {id: verifytoken}});
      if (!req.body) {
         res.status(400).send({message: "Tous les champs sont obligatoires!"});
         return;
      }
      try {
         if (user.dataValues.type == 1) { // Type 1 pour Professeur
            const teacher = await user.getTeacher();
            let publi = await teacher.createPublication(req.body);
            let lesson = await Lesson.findOne({where: {id: req.body.lesson}})
            await lesson.addPublication(publi);
            res.status(200).json({ publication : publi, lesson : lesson });
         } else {
            const student = await user.getStudent();
            let publi = await student.createPublication(req.body);
            let lesson = await lesson.findOne({where: {id: req.body.lesson}})
            await lesson.addPublication(publi);
            res.status(200).json({ publication : publi, lesson : lesson });
         }
         
      } catch (err) {
         res.status(500).send({ message: err.message || "Erreur"});
      }
   }
}

 // POST /publications/:id with token
 exports.update = async (req, res) => {
   let token = req.headers['x-access-token']; //récupération du token
   let verifytoken = jwt.verifyToken(token); //vérification de la validité du token
   if(!verifytoken) {
      res.status(401).json({message: "Accès interdit"});
   } else {
      if (!req.body) {
         res.status(400).send({message: "Tous les champs sont obligatoires!"});
         return;
      }
      try {
         const user = await User.findOne({where: {id: verifytoken}});
         let publi = await Publication.update(req.body, {where: {id: req.params.id}});
         res.status(200).json({ publication : publi});
         
      } catch (err) {
         res.status(500).send({ message: err.message || "Erreur"});
      }
   }
}