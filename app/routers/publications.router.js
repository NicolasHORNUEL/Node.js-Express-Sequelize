const express = require('express');
const router = express.Router();
const publicationController = require('../controller/publications.controller');

//router.get('/', publicationController.getAll);
//router.get('/:id', publicationController.getById);
router.post('/', publicationController.create);
router.put('/:id', publicationController.update);
//router.delete('/:id',publicationController.remove);

module.exports = router;
