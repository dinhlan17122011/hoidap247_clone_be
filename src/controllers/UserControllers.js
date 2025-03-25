const User = require('../models/userModels.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

const sendVerificationEmail = require('../utils/emailService.js');

const UserController = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const checkEmail = await User.findOne({ email });
            if (checkEmail) {
                return res.status(400).json({ message: 'Email đã được sử dụng' });
            }
            if (!username || !email || !password) {
                return res.status(400).json({ message: 'Thiếu thông tin' });
            }
            const verificationCode = Math.floor(10000 + Math.random() * 90000).toString();
            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = new User({
                username: username,
                email: email,
                password: hashPassword,
                role: 'user',
                status: 'Chưa xác thực',
                verificationCode: verificationCode,
                points: 0,
            });
            await newUser.save();
            await sendVerificationEmail(email, verificationCode);
            res.status(201).json({
                message: 'Đăng ký thành công',
                user: newUser,
                codeVerify: verificationCode,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    verifyEmail: async (req, res) => {
        try {
            const { email, verificationCode } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại' });
            }
            if (user.isVerified) {
                return res.status(400).json({ message: 'Tài khoản đã được xác thực' });
            }
            if (user.verificationCode !== verificationCode) {
                return res.status(400).json({ message: 'Mã xác thực không chính xác' });
            }
            user.status = 'Xác thực';
            user.verificationCode = null;
            await user.save();
            res.status(200).json({ message: 'Xác thực tài khoản thành công' });
        } catch (error) {
            console.error('Lỗi khi xác thực email:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const checkEmail = await User.findOne({ email });
            if ((checkEmail.status = 'Chưa xác thực')) {
                res.status(400).json({ message: 'Email chưa xác thực . Vui lòng xác thực' });
            }
            if (!checkEmail) {
                return res.status(400).json({ message: 'Email không tồn tại. Vui lòng đăng ký' });
            }
            if (!email || !password) {
                return res.status(400).json({ message: 'Thiếu thông tin' });
            }
            const decodePassword = await bcrypt.compare(password, checkEmail.password);
            if (!decodePassword) {
                return res.status(500).json({ message: 'Sai mặt khẩu' });
            }
            const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({
                message: 'Đăng nhập thành công',
                token: token,
                user_name: User.username,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    profileUser: async (req, res) => {
        try {
            const { id } = req.params;
            const profile = await User.findById(id);
            if (!profile) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
            res.status(200).json({
                message: `Profile của người dùng ${profile.username}`,
                profile,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    deleteUser: async (req, res) => {
            try {
                const { id } = req.params;
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: 'ID không hợp lệ' });
                }
                await User.findByIdAndDelete(id);
                res.redirect('/user')
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Lỗi server', error: error });
            }
        },
};

const UserViews = {
    manageUser: async (req, res) => {
        try {
            const users = await User.find().lean();
            console.log(users);

            res.render('manage/manageUser', { users });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
    detailsUser: async (req, res) => {
        try {
            const { id } = req.params;
            const users = await User.findById(id).lean();
            console.log(users);

            res.render('details/detalsUser', { user: users });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Lỗi server', error: error });
        }
    },
};

module.exports = { UserController, UserViews };
