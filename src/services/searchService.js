const { Question } = require('../models/questionModels.js');
const elasticlunr = require('elasticlunr');

const searchIndex = elasticlunr(function () {
    this.addField('title');
    this.addField('content');
    this.setRef('_id');
});

const buildIndex = async () => {
    const questions = await Question.find();
    questions.forEach((question) => index.addDoc(question));
};

const search = (query) => index.search(query, { expand: true });

module.exports = { buildIndex, search };