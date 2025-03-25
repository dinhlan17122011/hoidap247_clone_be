const express = require('express');
const router = express();
const { AnswerControllers } = require('../../controllers/answerControllers.js');

router.post('/addAnswer', AnswerControllers.createAnswer);

router.get('/:id', AnswerControllers.getAnswerByIdQuestion);

router.put('/:id', AnswerControllers.updateAnswer);

router.delete('/:id', AnswerControllers.deleteAnswer);

module.exports = router;
