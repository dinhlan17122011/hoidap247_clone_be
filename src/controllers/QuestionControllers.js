const mongoose = require('mongoose');
const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html');
const removeAccents = require('remove-accents');

const { Question, searchIndex } = require('../models/questionModels.js');
const { search } = require('../services/searchService.js');

const QuestionControllers = {
    createQuestion: async (req, res) => {
        try {
            const { userId, title, content, subject, tags } = req.body;
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: 'ID không hợp lệ' });
            }
            if (!userId || !title || !content || !subject || !tags) {
                return res.status(404).json({ message: 'Thiếu dữ liệu' });
            }
            const cleanContent = sanitizeHtml(content, {
                allowedTags: ['a', 'p', 'h1', 'em'],
                allowedAttributes: { a: ['href'] },
            });
            const slug = slugify(title, { lower: true, strict: true });
            const questions = new Question({
                userId,
                title,
                slug,
                content: cleanContent,
                subject,
                tags,
            });
            await questions.save();
            res.status(201).json({ message: 'Thành công !', data: questions });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    getQuestion: async (req, res) => {
        try {
            const questions = await Question.find();
            res.status(200).json(questions);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    getQuestionBySlug: async (req, res) => {
        try {
            const { slug } = req.params;
            const question = await Question.findOne({ slug });
            if (!question) return res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
            res.status(200).json(question);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    searchQuestion: async (req, res) => {
        try {
            let query = req.params.q;
            if (!query) return res.status(400).json({ message: 'Thiếu từ khóa' });
            query = removeAccents(query.toLowerCase());
            console.log('Query :', query);
            const ketqua = search(query);
            res.json(ketqua);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    updateQuestion: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID không hợp lệ' });
            }
            const update = await Question.findByIdAndUpdate(id, updateData, { new: true });
            await update.save();
            res.status(200).json({ message: `Cập nhật thành công câu hỏi vời id: ${id}` });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    deleteQuestion: async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID không hợp lệ' });
            }
            await Question.findByIdAndDelete(id);
            res.redirect('/question');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
};

const QuestionViews = {
    manageQuestion: async (req, res) => {
        try {
            const { search } = req.query;
            let questions;
            if (search) {
                questions = await Question.find({
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                    ],
                }).lean();
            } else {
                questions = await Question.find().lean();
            }
            res.render('manage/manageQuestion', { questions });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    detailsQuestion: async (req, res) => {
        try {
            const { slug } = req.params;
            const question = await Question.findOne({ slug }).lean();
            if (!question) return res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
            res.render('details/detailsQuestion', { question });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
};

module.exports = { QuestionControllers, QuestionViews };
