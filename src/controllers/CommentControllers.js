const Comment = require('../models/commentModels.js');
const mongoose = require('mongoose');

const CommentControllers = {
    createComment: async (req, res) => {
        try {
            const { userId, answerId, content } = req.body;
            if (
                !mongoose.Types.ObjectId.isValid(userId) ||
                !mongoose.Types.ObjectId.isValid(answerId)
            ) {
                return res.status(400).json({ message: 'ID không hợp lệ' });
            }
            if (!userId || !answerId || !content) {
                return res.status(404).json({ message: 'Thiếu dữ liệu' });
            }
            const comment = new Comment({
                userId,
                answerId,
                content,
            });
            await comment.save();
            res.status(201).json({ message: 'Thành công !', data: comment });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    getCommentByIdQuestion: async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID không hợp lệ' });
            }
            const CommentByIdQuestion = await Comment.find({ answerId: id });
            res.status(200).json({ questionId: id, CommentByIdQuestion });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    updateComment: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID không hợp lệ' });
            }
            const update = await Comment.findByIdAndUpdate(id, updateData, { new: true });
            await update.save();
            res.status(200).json({ message: `Cập nhật thành công bình luận vời id: ${id}` });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    deleteComment: async (req, res) => {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'ID không hợp lệ' });
            }
            await Comment.findByIdAndDelete(id);
            res.status(200).json({ message: `Đã xóa thành công bình luận vời id: ${id}` });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
};

const CommentViews = {
    manageComment: async (req, res) => {},
    detailsComment: async (req, res) => {},
};

module.exports = { CommentControllers, CommentViews };
