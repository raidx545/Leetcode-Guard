const express = require('express');
const router = express.Router();
const User = require('../models/User');
const OTP = require('../models/OTP');
const { validateLeetCodeUsername, getTotalSolved } = require('../services/leetcode');

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// STEP 1: Initiate registration
router.post('/initiate', async (req, res) => {
    const { leetcodeUsername, telegramUsername, telegramChatId } = req.body;

    // Validate required fields
    if (!leetcodeUsername || !telegramUsername || !telegramChatId) {
        return res.status(400).json({
            error: 'leetcodeUsername, telegramUsername, and telegramChatId are required'
        });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ leetcodeUsername });
        if (existingUser) {
            return res.status(400).json({
                error: 'This LeetCode username is already registered'
            });
        }

        // Validate LeetCode username exists and is public
        const validation = await validateLeetCodeUsername(leetcodeUsername);
        if (!validation.valid) {
            return res.status(400).json({ error: validation.error });
        }

        // Generate OTP
        const otpCode = generateOTP();

        // Store OTP in database (auto-deletes after 10 minutes)
        await OTP.create({
            leetcodeUsername,
            telegramChatId,
            telegramUsername,
            code: otpCode
        });

        // TODO: Send OTP via Telegram (will implement next)
        console.log(`📱 [DEV MODE] OTP for ${telegramUsername}: ${otpCode}`);

        res.json({
            success: true,
            message: 'OTP sent to your Telegram. Please verify to complete registration.',
            // Remove in production, only for testing:
            dev_otp: otpCode
        });

    } catch (error) {
        console.error('Registration initiate error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// STEP 2: Verify OTP and complete registration
router.post('/verify', async (req, res) => {
    const { leetcodeUsername, telegramChatId, telegramUsername, otpCode } = req.body;

    if (!leetcodeUsername || !telegramChatId || !telegramUsername || !otpCode) {
        return res.status(400).json({
            error: 'leetcodeUsername, telegramChatId, telegramUsername, and otpCode are required'
        });
    }

    try {
        // Find valid OTP
        const otpRecord = await OTP.findOne({
            leetcodeUsername,
            telegramChatId,
            telegramUsername,
            code: otpCode
        });

        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Get current solved count from LeetCode
        const currentCount = await getTotalSolved(leetcodeUsername);
        const today = new Date().toISOString().split('T')[0];

        // Create user
        const user = await User.create({
            leetcodeUsername,
            telegramChatId,
            telegramUsername,
            lastSolvedCount: currentCount,
            lastResetDate: today,
            isActive: true,
            notificationEnabled: true
        });

        // Delete used OTP
        await otpRecord.deleteOne();

        console.log(`✅ New user registered: ${leetcodeUsername} (${telegramUsername})`);

        res.json({
            success: true,
            message: 'Registration successful! You will receive daily reminders.',
            user: {
                leetcodeUsername: user.leetcodeUsername,
                telegramUsername: user.telegramUsername,
                currentStreak: user.currentStreak
            }
        });

    } catch (error) {
        console.error('Verification error:', error);

        if (error.code === 11000) {
            return res.status(400).json({ error: 'User already registered' });
        }

        res.status(500).json({ error: 'Internal server error' });
    }
});

// Check registration status
router.get('/status/:leetcodeUsername', async (req, res) => {
    const { leetcodeUsername } = req.params;

    try {
        const user = await User.findOne({ leetcodeUsername });

        if (!user) {
            return res.json({ registered: false });
        }

        res.json({
            registered: true,
            leetcodeUsername: user.leetcodeUsername,
            telegramUsername: user.telegramUsername,
            isActive: user.isActive,
            notificationEnabled: user.notificationEnabled,
            registeredAt: user.registeredAt
        });

    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;