const mongoose = require('mongoose');
const Question = require('../models/questionModels.js');

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
            const questions = new Question({
                userId,
                title,
                content,
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
    getQuestionById: async (req, res) => {
        try {
            const { id } = req.params;
            
            const question = await Question.findById(id);
            if (!question) return res.status(404).json({ message: 'Khồn tìm thấy dữ liệu' });
            res.status(200).json(question);
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
            res.status(200).json({ message: `Đã xóa thành công câu hỏi vời id: ${id}` });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
};

module.exports = QuestionControllers;
