const express = require('express');
const userController = require('../controllers/userController');
const unsubscribe = require('../controllers/unsubscribeController');
const subscribe = require('../controllers/subscribeController');
const adminAuth = require("../middleware/adminAuth");
const announceController = require('../controllers/announceController')
const router = express.Router();
router.post('/register', userController.register)

router.post("/announce", adminAuth, announceController.announcement);

router.post(
    "/unsubscribe",
    unsubscribe.unsubscribe
);

router.post(
    "/subscribe",
    subscribe.subscribe
);




module.exports = router