const express = require('express');
const router = express();
const QuestionControllers = require('../controllers/QuestionControllers.js');

router.post('/addQuestion', QuestionControllers.createQuestion);

router.get('/', QuestionControllers.getQuestion);

router.get('/:id', QuestionControllers.getQuestionById);

router.put('/:id', QuestionControllers.updateQuestion);

router.delete('/:id', QuestionControllers.deleteQuestion);

module.exports = router;
