const express = require('express');
const router = express();
const {QuestionViews } = require('../../controllers/QuestionControllers.js');

router.get('/', QuestionViews.manageQuestion);

router.get('/:slug', QuestionViews.detailsQuestion);

module.exports = router;
