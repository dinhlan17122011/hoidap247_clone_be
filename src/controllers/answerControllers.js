const Answer = require('../models/answerModels.js');
const { Question } = require('../models/questionModels.js');
const mongoose = require('mongoose');

const AnswerControllers = {
    createAnswer: async (req, res) => {
        try {
            const { questionId, userId, content } = req.body;
            if (!questionId || !userId || !content) {
                res.status(404).json({ message: 'Thiếu dữ liệu' });
            }
            const question = await Question.findById(questionId);
            const titleQuestion = question.title;
            console.log(titleQuestion);

            const answer = new Answer({
                questionId,
                userId,
                titleQuestion: titleQuestion,
                content,
            });
            await Question.findByIdAndUpdate(questionId, { $inc: { answersCount: 1 } });
            await answer.save();
            res.status(201).json({ message: 'Thành công', answer });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    getAnswerByIdQuestion: async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID không hợp lệ' });
            }
            const answerByIdQuestion = await Answer.find({ questionId: id });
            res.status(200).json({ questionId: id, answerByIdQuestion });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    updateAnswer: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID không hợp lệ' });
            }
            const update = await Answer.findByIdAndUpdate(id, updateData, { new: true });
            await update.save();
            res.status(200).json({ message: `Cập nhật thành công câu trả lời vời id: ${id}` });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    deleteAnswer: async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID không hợp lệ' });
            }
            await Answer.findByIdAndDelete(id);
            // res.status(200).json({ message: `Đã xóa thành công câu trả lời vời id: ${id}` });
            res.redirect('/answer');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
};

const AnswerViews = {
    manageAnswer: async (req, res) => {
        try {
            const { search } = req.query;
            let answer;
            if (search) {
                answer = await Answer.find({
                    $or: [{ titleQuestion: { $regex: search, $options: 'i' } }],
                }).lean();
            } else {
                answer = await Answer.find().lean();
            }
            res.render('manage/manageAnswer', { answer });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    detailsAnswer: async (req, res) => {
        try {
            const { id } = req.params;
            const answer = await Answer.findById(id).lean();
            if (!answer) return res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
            res.render('details/detailsAnswer', { answer });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
};

module.exports = { AnswerControllers, AnswerViews };
