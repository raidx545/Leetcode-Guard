const User = require("../models/user");
const { getTotalSolved } = require("./leetcodeService");

async function updateAllUsers() {
    const users = await User.find({
        isActive: true
    });

    console.log(
        `Updating ${users.length} users`
    );

    for (const user of users) {
        try {
            const data = await getTotalSolved(
                user.leetcodeUsername
            );

            user.lastSolvedCount =
                data.totalSolved;

            user.lastReminderDate = null;

            await user.save();

            console.log(
                `${user.leetcodeUsername} updated`
            );
        } catch (error) {
            console.error(
                `${user.leetcodeUsername}: ${error.message}`
            );
        }
    }
}

module.exports = {
    updateAllUsers
};