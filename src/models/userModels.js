const mongoose = require('mongoose');
const slugify = require('slugify');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    status: { type: String, required: true, enum: ['Xác thực', 'Chưa xác thực'] },
    points: { type: Number, required: true },
    verificationCode: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

userSchema.pre('save', (next) => {
    if (!this.username) return next();
    this.slug = slugify(this.title, { lower: true, strict: true });
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
