const express = require('express');
const router = express.Router();
const studentController = require('../controller/students.controller');

// cet endroit n'est accessible que pour les utilisateurs authentifiés: dans req.header["x-access-token"]
router.get('/', studentController.getAll);
router.get('/:id', studentController.getById);
router.get('/add-student-to-lesson/:id1/:id2', studentController.addLesson)
router.post('/', studentController.create);
router.put('/:id', studentController.update);
router.delete('/:id', studentController.remove);

module.exports = router;