const app = require("./app");
const PORT = process.env.PORT || 3001;
const connectDB = require("./config/db");
const cron = require("node-cron");
const { checkAllUsers } = require("./services/checkAllUsers");
const { updateAllUsers } = require("./services/dailyUpdateService");

async function startServer() {
    try {
        await connectDB();

        // Start Express first so API is available
        app.listen(PORT, () => {
            console.log(
                `Server running on port ${PORT}`
            );
        });

        // Start WhatsApp Client (non-blocking)
        const { startWhatsApp } = require('./whatsapp');
        startWhatsApp().catch(err => {
            console.error('[WhatsApp] Failed to start:', err.message);
        });

        // Schedule: Send reminders at 11:20 PM IST every day
        cron.schedule("20 23 * * *", async () => {
            console.log("[Cron] Running reminder job at 11:20 PM IST...");
            try {
                await checkAllUsers();
                console.log("[Cron] Reminder job completed.");
            } catch (error) {
                console.error("[Cron] Reminder job failed:", error.message);
            }
        }, { timezone: "Asia/Kolkata" });

        // Schedule: Daily update at 5:00 AM IST (reset baselines)
        cron.schedule("0 5 * * *", async () => {
            console.log("[Cron] Running daily update at 5:00 AM IST...");
            try {
                await updateAllUsers();
                console.log("[Cron] Daily update completed.");
            } catch (error) {
                console.error("[Cron] Daily update failed:", error.message);
            }
        }, { timezone: "Asia/Kolkata" });

        console.log("[Cron] Scheduled: Reminders at 11:20 PM IST, Daily update at 5:00 AM IST");

    } catch (error) {
        console.error(
            "Failed to start server:",
            error
        );

        process.exit(1);
    }
}

startServer();








// require("./cron/reminderCron");
// require("./cron/dailyUpdateCron");
// require("./bot");

// const app = require('./app');
// const PORT = process.env.PORT || 3001;
// const connectDB = require('./config/db')


// connectDB();
// app.listen(PORT, () => {
//     console.log(`Server is running on http://127.0.0.1:${PORT}/`)
// })