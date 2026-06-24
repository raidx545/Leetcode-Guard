const User = require("../models/user");

exports.unsubscribe = async (req, res) => {
    try {
        const { whatsappNumber } = req.body;

        if (!whatsappNumber) {
            return res.status(400).json({
                success: false,
                message: "WhatsApp number is required"
            });
        }

        const user = await User.findOne({
            whatsappNumber
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

