const express = require('express');
const router = express();
const { CommentControllers } = require('../../controllers/CommentControllers.js');

router.post('/addComment', CommentControllers.createComment);

router.get('/:id', CommentControllers.getCommentByIdQuestion);

router.put('/:id', CommentControllers.updateComment);

router.delete('/:id', CommentControllers.deleteComment);

module.exports = router;
