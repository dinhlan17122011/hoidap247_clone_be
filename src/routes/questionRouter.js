const express = require('express');
const router = express();
const QuestionControllers = require('../controllers/QuestionControllers.js');

router.post('/addQuestion', QuestionControllers.createQuestion);

router.get('/', QuestionControllers.getQuestion);

router.get('/:slug', QuestionControllers.getQuestionBySlug);

router.get('/search', QuestionControllers.searchQuestion);

router.put('/:id', QuestionControllers.updateQuestion);

router.delete('/:id', QuestionControllers.deleteQuestion);

module.exports = router;
