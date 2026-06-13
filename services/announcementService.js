const User = require("../models/user");
const telegramService = require("./telegramService");

async function sendAnnouncement(message) {
    const users = await User.find({
        isActive: true
    });

    let success = 0;
    let failed = 0;

    for (const user of users) {
        try {
            await telegramService.sendMessage(
                user.telegramChatId,
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