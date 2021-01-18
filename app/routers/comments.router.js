const express = require('express');
const router = express.Router();
const commentController = require('../controller/comments.controller');

router.get('/:id/comments', commentController.getAll);
router.get('/:id/comments/:idComment', commentController.getById);
router.post('/:id/comments', commentController.create);
router.put('/:id/comments/:idComment', commentController.update);
router.delete('/:id/comments/:idComment', commentController.remove);

module.exports = router;