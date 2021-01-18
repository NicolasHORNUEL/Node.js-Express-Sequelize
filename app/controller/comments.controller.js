const db = require("../models/db");
const User = db.users;
const Publication = db.publications;
const Comment = db.comments;
const jwt = require("../services/auth.services");
const CommentClass = require('../models/comments');

// GET /publications/:id/comments
exports.getAll = async (req, res) => {
   await jwt.verifyToken(req, res);
   try {
      const publi = await Publication.findByPk(req.params.id);
      if (publi === null) {
         res.status(500).send({message: `Publication n°${req.params.id} inexistante`}); 
      } else {
         let result = await publi.getComments();
         if (result.length > 0) {res.status(200).json(result);}
         else {res.status(200).json({message: "Aucun commentaire existant"});}
      }
   } catch (err) {
      res.status(500).send({message: err});
   }
};

// GET /publications/:id/comments/:idComment
exports.getById = async (req, res) => {
   await jwt.verifyToken(req, res);
   try {
      const publi = await Publication.findByPk(req.params.id);
      if (publi === null) {
         res.status(500).send({message: `Publication n°${req.params.id} inexistante`}); 
      } else {
         const idCom = req.params.idComment;
         const comment = await Comment.findByPk(idCom);
         const ship = await publi.hasComment(comment);
         if (ship) {
            let result = await Comment.findOne({where: {id: idCom}}); // = .findByPk(id);
            res.status(200).json(result);
         } else {
            res.status(400).json({message: "Aucun commentaire trouvé"});
         }
      }
   } catch (err) {
      res.status(500).send({message: err});
   }
}

 // POST /publications/:id/comments
 exports.create = async (req, res) => {
   let userId = await jwt.verifyToken(req, res);
   if (!req.body) {
      res.status(400).send({message: "Tous les champs sont obligatoires!"});
      return;
   }
   try {
      let publi = await Publication.findByPk(req.params.id);
      if (publi === null) {
         res.status(500).send({message: `Publication n°${req.params.id} inexistante`}); 
      } else {
         const user = await User.findOne({where: {id: userId}});
         let comment = await publi.createComment(req.body);
         if (user.dataValues.type == 1) { // Type 1 pour Professeur
            let teacher = await user.getTeacher();
            await teacher.addComment(comment);
            res.status(200).json(comment);   
         } else if (user.dataValues.type == 2) { // Type 2 pour Etudiant
            let student = await user.getStudent();
            await student.addComment(comment);
            res.status(200).json(comment);  
         } else {
            res.status(401).json({message: "Vous ne disposez pas des droits."});
         }  
      }    
   } catch (err) {
      res.status(500).send({ message: err.message || "Erreur"});
   }
}

 // PUT /publications/:id/comments/:idComment
 exports.update = async (req, res) => {
   let userId = await jwt.verifyToken(req, res);
   if (!req.body) {
      res.status(400).send({message: "Tous les champs sont obligatoires!"});
      return;
   }
   try {
      let publi = await Publication.findByPk(req.params.id);
      if (publi === null) {
         res.status(500).send({message: `Publication n°${req.params.id} inexistante`}); 
      } else {
         let comment = await Comment.findByPk(req.params.idComment);
         if (comment === null) {
            res.status(500).json({message: `Commentaire inexistant`}); 
         } else {

            let userToken = await User.findOne({where: {id: userId}});
            if (userToken.dataValues.type == 1) { // Type 1 pour Professeur
               let teacher = await userToken.getTeacher();
               let ship = await teacher.hasComment(comment);
               if (ship) {
                  await comment.update(req.body, {where: {id: req.params.idComment}});
                  let newCom = new CommentClass(req.body);
                  newCom.id = parseInt(req.params.idComment);
                  res.status(200).json({ comment : newCom }); 
               } else {
                  res.status(401).json({message: "Vous ne disposez pas des droits."});
               }
            } else if (userToken.dataValues.type == 2) { // Type 2 pour Etudiant
               let student = await userToken.getStudent();
               let ship = await student.hasComment(comment);
               if (ship) {
                  await comment.update(req.body, {where: {id: req.params.idComment}});
                  let newCom = new CommentClass(req.body);
                  newCom.id = parseInt(req.params.idComment);
                  res.status(200).json({ comment : newCom }); 
               } else {
                  res.status(401).json({message: "Vous ne disposez pas des droits."});
               }
            } else if (userToken.dataValues.type == 3) {
               res.status(401).json({message: "Vous ne disposez pas des droits."});
            }

         }
      }
   } catch (err) {
      res.status(500).send({ message: err.message || "Erreur"});
   }
}

// DELETE /publications/:id/comments/:idComment
exports.remove = async (req, res) => {
   let userId = await jwt.verifyToken(req, res);
   try {
      let publi = await Publication.findByPk(req.params.id);
      if (publi === null) {
         res.status(500).json({message: `Publication n°${req.params.id} inexistante`}); 
      } else {
         let comment = await Comment.findByPk(req.params.idComment);
         if (comment === null) {
            res.status(500).json({message: `Commentaire inexistant`}); 
         } else {

            let userToken = await User.findOne({where: {id: userId}});
            if (userToken.dataValues.type == 1) { // Type 1 pour Professeur
               let teacher = await userToken.getTeacher();
               let ship = await teacher.hasComment(comment);
               if (ship) {
                  await Comment.destroy({where: { id: req.params.idComment }});
                  let result = await Comment.findByPk(req.params.idComment);
                  if (result === null) {
                     res.status(200).json({ message: "Le commentaire a été supprimé!"});
                  }
               } else {
                  res.status(401).json({message: "Vous ne disposez pas des droits."});
               }
            } else if (userToken.dataValues.type == 2) { // Type 2 pour Etudiant
               let student = await userToken.getStudent();
               let ship = await student.hasComment(comment);
               if (ship) {
                  await Comment.destroy({where: { id: req.params.idComment }});
                  let result = await Comment.findByPk(req.params.idComment);
                  if (result === null) {
                     res.status(200).json({ message: "Le commentaire a été supprimé!"});
                  }
               } else {
                  res.status(401).json({message: "Vous ne disposez pas des droits."});
               }
            } else if (userToken.dataValues.type == 3) {
               res.status(401).json({message: "Vous ne disposez pas des droits."});
            }
         }
      }
   } catch (err) {
      res.status(500).json({ message: err.message || "Erreur"});
   }
}