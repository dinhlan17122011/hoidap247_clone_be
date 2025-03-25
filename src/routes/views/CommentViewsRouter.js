const express = require('express');
const router = express();
const { CommentViews } = require('../../controllers/CommentControllers.js');

router.get('/', CommentViews.manageComment);

router.get('/:id', CommentViews.detailsComment);

module.exports = router;
