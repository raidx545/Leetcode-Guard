const User = require("../models/User");
const { checkUser } = require("./reminderService");

let isRunning = false;

async function checkAllUsers() {
    if (isRunning) {
        console.log(
            "Reminder job already running. Skipping..."
        );
        return;
    }

    isRunning = true;

    try {
        const users = await User.find({
            isActive: true,
        });

        console.log(
            `Checking ${users.length} users`
        );

        for (const user of users) {
            try {
                const result = await checkUser(user);


                console.log(
                    `[Reminder] ${user.leetcodeUsername} => ${result.reason}`
                );

                // Telegram safety delay
                await new Promise(resolve =>
                    setTimeout(resolve, 100)
                );

            } catch (error) {
                console.error(
                    `${user.leetcodeUsername}: ${error.message}`
                );
            }
        }
    } finally {
        isRunning = false;
    }
}

module.exports = {
    checkAllUsers,
};