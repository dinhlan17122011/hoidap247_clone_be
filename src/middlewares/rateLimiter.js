const rateLimiter = require('express-rate-limit');

const limtier = rateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 20,
    message: 'Bạn đã gửi quá nhiều yêu cầu . Vui lòng thử lại sau !',
});

module.exports = limtier