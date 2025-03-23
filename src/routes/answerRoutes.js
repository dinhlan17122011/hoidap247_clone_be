const express = require('express');
const router = express();
const answerControllers = require('../controllers/answerControllers.js');

router.post('/addAnswer', answerControllers.createAnswer);

router.get('/:id', answerControllers.getAnswerByIdQuestion);

router.put('/:id', answerControllers.updateAnswer);

router.delete('/:id', answerControllers.deleteAnswer);

module.exports = router;
