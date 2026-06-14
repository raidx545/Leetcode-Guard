const express = require("express");

const router = express.Router();

const {
    dailyUpdate,
    sendReminder
} = require("../controllers/jobController");

router.post(
    "/daily-update",
    dailyUpdate
);

router.post(
    "/send-reminders",
    sendReminder
);

module.exports = router;