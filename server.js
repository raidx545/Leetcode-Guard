const app = require("./app");
const PORT = process.env.PORT || 3001;
const connectDB = require("./config/db");

async function startServer() {
    try {
        await connectDB();

        // Start Telegram Bot
        require("./bot");

        app.listen(PORT, () => {
            console.log(
                `Server running on port ${PORT}`
            );
        });

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