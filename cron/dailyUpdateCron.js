const cron = require("node-cron");

const {
    updateAllUsers
} = require("../services/dailyUpdateService");

cron.schedule(
    "21 9 * * *",  // Runs at 12:00 AM UTC = 5:30 AM IST
    async () => {
        console.log(
            "Running daily update job at 5:30 AM IST"
        );

        await updateAllUsers();
    }
);