const cron = require("node-cron");
const {
    updateAllUsers
} = require("../services/dailyUpdateService");

console.log("Daily update cron loaded");

cron.schedule(
    "0 0 * * *",
    async () => {
        console.log(
            "Running daily update job at 00:00 UTC"
        );

        await updateAllUsers();
    },
    {
        timezone: "UTC",
    }
);