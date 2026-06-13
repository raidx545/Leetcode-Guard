const cron = require("node-cron");
const {
    checkAllUsers
} = require("../services/checkAllUsers");

console.log("Reminder cron loaded");

cron.schedule(
    // "30 16 * * *",
    "53 16 * * * ",
    async () => {
        console.log(
            "Running reminder job at 16:30 UTC"
        );

        await checkAllUsers();
    },
    {
        timezone: "UTC",
    }
);