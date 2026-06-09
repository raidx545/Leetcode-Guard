import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // Core identification
    leetcodeUsername: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    telegramChatId: {
        type: String,
        required: true,
        unique: true
    },

    // Tracking
    lastSolvedCount: {
        type: Number,
        default: null
    },
    lastCheckDate: {
        type: String,  // Format: YYYY-MM-DD
        default: null
    },

    // Status
    isActive: {
        type: Boolean,
        default: true
    },

    // When they registered
    registeredAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', userSchema);