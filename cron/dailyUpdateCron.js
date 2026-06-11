const cron = require("node-cron");

const {
    updateAllUsers
} = require("../services/dailyUpdateService");

cron.schedule(
    "5 1 * * *",
    async () => {
        console.log(
            "Running daily update job"
        );

        await updateAllUsers();
    }
);