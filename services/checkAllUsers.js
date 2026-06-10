const User = require("../models/User");
const { checkUser } = require("./reminderService");

async function checkAllUsers() {
    const users = await User.find({
        isActive: true,
    });

    console.log(`Checking ${users.length} users`);

    for (const user of users) {
        try {
            const result = await checkUser(user);

            console.log(
                `${user.leetcodeUsername} => ${result.reminded
                    ? "Reminder Sent"
                    : "Already Solved"
                }`
            );
        } catch (error) {
            console.error(
                `${user.leetcodeUsername}`,
                error.message
            );
        }
    }
}

module.exports = {
    checkAllUsers,
};