const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    titleQuestion: { type: String, required: true },
    content: { type: String, required: true },
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
    commentCount: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
