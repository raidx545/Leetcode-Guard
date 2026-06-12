const cron = require("node-cron");
const { checkAllUsers } = require("../services/checkAllUsers");

cron.schedule(
    "23 9 * * *",  // 9:00 PM in specified timezone
    async () => {
        console.log("Running reminder job at 10:00 PM IST");
        await checkAllUsers();
    },
    {
        timezone: "Asia/Kolkata"
    }
);

// real "30 16 * * *"

// 9pm test 0 21 * * *
