const express = require('express');
const userController = require('../controllers/userController');
const { sendAnnouncement } = require('../services/announcementService')
const unsubscribe = require('../controllers/unsubscribeController');
const subscribe = require('../controllers/subscribeController');

const router = express.Router();
router.post('/register', userController.register)

router.post("/announce", async (req, res) => {
    const { message } = req.body;

    const result =
        await sendAnnouncement(message);

    res.json(result);
});

router.post(
    "/unsubscribe",
    unsubscribe.unsubscribe
);

router.post(
    "/subscribe",
    subscribe.subscribe
);




module.exports = router