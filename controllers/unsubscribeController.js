const User = require("../models/User");

exports.unsubscribe = async (req, res) => {
    try {
        const { telegramChatId } = req.body;

        if (!telegramChatId) {
            return res.status(400).json({
                success: false,
                message: "Telegram Chat ID is required"
            });
        }

        const user = await User.findOne({
            telegramChatId
        });


        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isActive = false;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Successfully unsubscribed"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

