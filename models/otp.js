const mongoose = require('mongoose')


const otpSchema = new mongoose.Schema({
    leetcodeUsername: {
        type: String,
        required: true
    },
    telegramChatId: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600  // Auto-delete after 10 minutes (600 seconds)
    }
});
module.exports = otpSchema;