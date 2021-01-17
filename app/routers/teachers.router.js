const express = require('express');
const router = express.Router();
const teacherController = require('../controller/teachers.controller');

router.get('/', teacherController.getAll);
router.get('/:id', teacherController.getById);

module.exports = router;