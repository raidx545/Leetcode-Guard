const { getTotalSolved } = require("./leetcodeService");
const telegramService = require("./telegramService");

async function checkUser(user) {
    try {
        const data = await getTotalSolved(
            user.leetcodeUsername
        );

        const totalSolved =
            data?.totalSolved ?? 0;

        const today = new Date()
            .toISOString()
            .split("T")[0];

        // Already reminded today
        if (
            user.lastReminderDate === today
        ) {
            return {
                reminded: false,
                reason:
                    "Already reminded today",
                currentSolved:
                    totalSolved
            };
        }
        // console.log({
        //     username: user.leetcodeUsername,
        //     totalSolved,
        //     lastSolvedCount: user.lastSolvedCount
        // });

        const shouldRemind =
            totalSolved <=
            user.lastSolvedCount;

        if (shouldRemind) {
            try {
                await telegramService.sendMessage(
                    user.telegramChatId,
                    `⚠️ Hey ${user.leetcodeUsername}, don't lose your streak!`
                );

                user.lastReminderDate =
                    today;

                await user.save();

            } catch (error) {
                console.error(
                    `Telegram failed for ${user.leetcodeUsername}:`,
                    error.message
                );

                return {
                    reminded: false,
                    reason:
                        "Telegram failed",
                    currentSolved:
                        totalSolved
                };
            }
        }

        return {
            reminded: shouldRemind,
            reason: shouldRemind
                ? "Reminder sent"
                : "Already solved today",
            currentSolved: totalSolved
        };

    } catch (error) {
        console.error(
            `LeetCode check failed for ${user.leetcodeUsername}:`,
            error.message
        );

        throw error;
    }
}

module.exports = { checkUser };