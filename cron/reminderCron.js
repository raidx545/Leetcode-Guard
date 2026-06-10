const cron = require("node-cron");
const { checkAllUsers } = require("../services/checkAllUsers");

cron.schedule("* * * * *", async () => {
    console.log("Running reminder job");

    await checkAllUsers();
});