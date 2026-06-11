require("./cron/reminderCron");
require("./cron/dailyUpdateCron");

const app = require('./app');
const PORT = process.env.PORT || 3001;
const connectDB = require('./config/db')


connectDB();
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}/`)
})