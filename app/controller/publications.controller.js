const db = require("../models/db");
const User = db.users;
const Publication = db.publications;
const Lesson = db.lessons;
const jwt = require("../services/auth.services");
const PublicationClass = require('../models/publications');

// GET /publications
exports.getAll = async (req, res) => {
   await jwt.verifyToken(req, res);
   try {
      let result = await Publication.findAll()
      res.status(200).json(result);
   } catch (err) {
      res.status(500).send({message: err.message || "Erreur lors de la récupération des cours."});
   }
};

// GET /publications/:id
exports.getById = async (req, res) => {
   await jwt.verifyToken(req, res);
   try {
      const id = req.params.id;
      let result = await Publication.findOne({where: {id: id}, raw: true}); // = Publication.findByPk(id);
      if (result) {
         res.status(200).json({result, message: "Vous pouvez ajouter un commentaire"});
      } else {
         res.status(400).json({message: "Aucune publication id = " + id});
      }
   } catch (err) {
      res.status(500).send({message: err});
   }
}

 // POST /publications/:idLesson with token
 exports.create = async (req, res) => {
   let userId = await jwt.verifyToken(req, res);
   if (!req.body) {
      res.status(400).send({message: "Tous les champs sont obligatoires!"});
      return;
   }
   try {
      let user = await User.findOne({where: {id: userId}});
      if (user.dataValues.type == 1) { // Type 1 pour Professeur
         const teacher = await user.getTeacher();
         let publi = await teacher.createPublication(req.body);
         let lesson = await Lesson.findByPk(req.params.idLesson);
         await lesson.addPublication(publi);
         res.status(200).json({ publication : publi, lesson : lesson });
      } else if (user.dataValues.type == 2) { // Type 2 pour Etudiant
         const student = await user.getStudent();
         let publi = await student.createPublication(req.body);
         let lesson = await Lesson.findByPk(req.params.idLesson);
         await lesson.addPublication(publi);
         res.status(200).json({ publication : publi, lesson : lesson });
      } else {
         res.status(401).json({message: "Vous ne disposez pas des droits."});
      }    
   } catch (err) {
      res.status(500).send({ message: err.message || "Erreur"});
   }
}

 // PUT /publications/:id with token
 exports.update = async (req, res) => {
   let userId = await jwt.verifyToken(req, res);
   if (!req.body) {
      res.status(400).send({message: "Tous les champs sont obligatoires!"});
      return;
   }
   try {
      let userToken = await User.findOne({where: {id: userId}});
      let publi = await Publication.findByPk(req.params.id);

      if (publi && userToken.dataValues.type == 1) { // Type 1 pour Professeur
         let teacher = await userToken.getTeacher();
         result = await teacher.hasPublication(publi);
         if (result) {
            await Publication.update(req.body, {where: {id: req.params.id}});
            let newPubli = new PublicationClass(req.body);
            newPubli.id = parseInt(req.params.id);
            res.status(200).json({ publication : newPubli }); 
         } else {
            res.status(401).json({message: `Vous ne disposez pas des droits`});
         } 

      } else if (publi && userToken.dataValues.type == 2) { // Type 2 pour Etudiant
         let student = await userToken.getStudent();
         result = await student.hasPublication(publi);
         if (result) {
            await Publication.update(req.body, {where: {id: req.params.id}});
            let newPubli = new PublicationClass(req.body);
            newPubli.id = parseInt(req.params.id);
            res.status(200).json({ publication : newPubli }); 
         } else {
            res.status(401).json({message: `Vous ne disposez pas des droits`});
         }

      } else if (publi && userToken.dataValues.type == 3) { // Type 3 simple internaute
         res.status(401).json({message: "Vous ne disposez pas des droits."});

      } else if (!publi) {
         res.status(500).json({message: `Erreur : la publication ${req.params.id} n'existe pas.`});
      }

   } catch (err) {
      res.status(500).send({ message: err.message || "Erreur"});
   }
}

// DELETE /publications/:id with token
exports.remove = async (req, res) => {
   let userId = await jwt.verifyToken(req, res);
   const id = req.params.id;
   try {
      let publi = await Publication.findByPk(id);
      let userToken = await User.findOne({where: {id: userId}});

      if (publi && userToken.dataValues.type == 1) { // Type 1 pour Professeur
         let teacher = await userToken.getTeacher();
         ship = await teacher.hasPublication(publi);
         if (ship) {
            await Publication.destroy({where: { id: id }});
            let result = await Publication.findByPk(id);
            if (result === null) {
               res.status(200).send({ message: "La publication a été supprimé!"});
            }
         } else {
            res.status(401).json({message: `Cette publication ne vous appartient pas`});
         }

      } else if (publi && userToken.dataValues.type == 2) { // Type 2 pour Etudiant
         let student = await userToken.getStudent();
         ship = await student.hasPublication(publi);
         if (ship) {
            await Publication.destroy({where: { id: id }});
            let result = await Publication.findByPk(id);
            if (result === null) {
               res.status(200).send({ message: "La publication a été supprimé!"});
            }
         } else {
            res.status(401).json({message: `Cette publication ne vous appartient pas`});
         }

      } else if (publi && userToken.dataValues.type == 3) { // Type 3 simple internaute
         res.status(401).json({message: "Vous ne disposez pas des droits."});

      } else if (!publi) {
         res.status(500).send({message: `Erreur : la publication ${id} n'existe pas.`});
      }
   } catch (err) {
      res.status(500).send({ message: err.message || "Erreur"});
   }
}