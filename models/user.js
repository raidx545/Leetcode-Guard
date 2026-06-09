const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        leetcodeUsername: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        telegramChatId: {
            type: String,
            required: true,
            unique: true
        },
        lastSolvedCount: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);