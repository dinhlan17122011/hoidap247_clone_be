const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: `Chào mừng`,
        to: email,
        subject: 'Xác thực tài khoản của bạn',
        html: `<h3>Chào mừng bạn đến với ứng dụng của chúng tôi!</h3>
               <p>Mã xác thực của bạn là:</p>
               <h2>${verificationCode}</h2>
               <p>Nhập mã này vào trang xác thực tài khoản để hoàn tất.</p>`,
    };
    return transporter.sendMail(mailOptions);
};
module.exports = { sendVerificationEmail };
