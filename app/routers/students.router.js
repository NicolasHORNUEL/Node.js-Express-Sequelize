const express = require('express');
const router = express.Router();
const studentController = require('../controller/students.controller');

router.get('/', studentController.getAll);
router.get('/:id', studentController.getById);
router.get('/add-friend/:id1/:id2', studentController.createFriend);
router.get('/remove-friend/:id1/:id2', studentController.deleteFriend)

module.exports = router;