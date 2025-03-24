const mongoose = require('mongoose');
const slugify = require('slugify');
const elasticlunr = require('elasticlunr');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    subject: { type: String, required: true }, //Môn học
    slug: { type: String, required: true },
    tags: [{ type: String }],
    answersCount: { type: Number, default: 0, required: true },
    createdAt: { type: Date, default: Date.now },
});

const searchIndex = elasticlunr(function () {
    this.addField('title');
    this.addField('content');
    this.setRef('_id');
});

questionSchema.pre('save', (next) => {
    if (!this.title) return next();
    this.slug = slugify(this.title, { lower: true, strict: true });
    next();
});

questionSchema.post('save', async (doc) => {
    if (doc) {
        const questions = await Question.find();
        questions.forEach((q) => {
            searchIndex.updateDoc({
                _id: doc._id.toString(),
                title: doc.title,
                content: doc.content,
            });
        });
    }
});

questionSchema.post('findOneAndUpdate', (doc) => {
    if (doc) {
        searchIndex.updateDoc({
            _id: doc._id.toString(),
            title: doc.title,
            content: doc.content,
        });
    }
});

questionSchema.post('findOneAndDelete', (doc) => {
    if (doc) {
        searchIndex.removeDocByRef(doc._id.toString());
    }
});

const Question = mongoose.model('Question', questionSchema);
module.exports = { Question, searchIndex };
