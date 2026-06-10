const { getTotalSolved } = require("./leetcodeService");
const telegramService = require("./telegramService");

async function checkUser(user) {
    const data = await getTotalSolved(
        user.leetcodeUsername
    );

    const totalSolved = data?.totalSolved ?? 0;

    const today = new Date()
        .toISOString()
        .split("T")[0];

    // User already got reminder today
    if (user.lastReminderDate === today) {
        return {
            reminded: false,
            reason: "Already reminded today",
            currentSolved: totalSolved
        };
    }

    const shouldRemind =
        totalSolved <= user.lastSolvedCount;

    if (shouldRemind) {
        await telegramService.sendMessage(
            user.telegramChatId,
            `⚠️ Hey ${user.leetcodeUsername}, don't lose your streak!`
        );

        user.lastReminderDate = today;
        await user.save();
    }

    return {
        reminded: shouldRemind,
        currentSolved: totalSolved
    };
}

module.exports = { checkUser };