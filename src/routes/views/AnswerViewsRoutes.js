const express = require('express');
const router = express();
const { AnswerViews } = require('../../controllers/answerControllers.js');

router.get('/', AnswerViews.manageAnswer);

router.get('/:id', AnswerViews.detailsAnswer);

module.exports = router;
