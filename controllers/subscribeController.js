const User = require("../models/User");

exports.subscribe = async (req, res) => {
    try {
        const { telegramChatId } = req.body;

        const user = await User.findOne({
            telegramChatId
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isActive = true;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Successfully subscribed"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};