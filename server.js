const app = require("./app");
const PORT = process.env.PORT || 3001;
const connectDB = require("./config/db");

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