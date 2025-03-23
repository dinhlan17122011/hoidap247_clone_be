const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    subject: { type: String, required: true }, //Môn học
    tags: [{ type: String }],
    answersCount: { type: Number, default: 0, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
