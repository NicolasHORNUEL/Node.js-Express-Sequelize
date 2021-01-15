const express = require('express');
const router = express.Router();
const teacherController = require('../controller/teachers.controller');

// cet endroit n'est accessible que pour les utilisateurs authentifiés: dans req.header["x-access-token"]
router.get('/', teacherController.getAll);
router.get('/:id', teacherController.getById);

module.exports = router;