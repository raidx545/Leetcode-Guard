const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    leetcodeUsername: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    telegramChatId: {
        type: String,
        required: true,
        unique: true,
    },

    lastSolvedCount: {
        type: Number,
        required: true,
    },

    lastCheckDate: {
        type: Date,
        default: null,
    },

    reminderLevel: {
        type: Number,
        default: 0,
    },

    lastReminderSentAt: {
        type: Date,
        default: null,
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    registeredAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.index({ isActive: 1 });

module.exports = userSchema