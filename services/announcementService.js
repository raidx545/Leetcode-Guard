const User = require("../models/user");
const whatsappService = require("./whatsappService");

async function sendAnnouncement(message) {
    const users = await User.find({
        isActive: true
    });

    let success = 0;
    let failed = 0;

    for (const user of users) {
        try {
            await whatsappService.sendMessage(
                user.whatsappNumber,
                message
            );

            success++;
        } catch (error) {
            failed++;
        }
    }

    return {
        success,
        failed
    };
}

module.exports = {
    sendAnnouncement
};