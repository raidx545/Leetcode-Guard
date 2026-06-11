const express = require('express');
const userController = require('../controllers/userController');
const sendMessage = require('../services/telegramService')
const User = require('../models/User');
const telegramService = require('../services/telegramService');
const { checkUser } = require('../services/reminderService');
const { getTotalSolved } = require('../services/leetcodeService');
const {
    updateAllUsers
} = require("../services/dailyUpdateService");

const router = express.Router();


router.get("/test-telegram", async (req, res) => {
    try {
        await sendMessage.sendMessage(
            1248021575,
            "Hello from LeetCode Tracker 🚀"
        );

        res.json({
            status: "success"
        });
    } catch (err) {
        res.status(500).json({
            status: "fail",
            message: err.message
        });
    }
});


router.get(
    "/test-daily-update",
    async (req, res) => {
        try {
            await updateAllUsers();

            res.json({
                success: true,
                message:
                    "Daily update completed"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);

router.get('/test-reminder/:id', async (req, res) => {
    const user = await User.findById(req.params.id);

    const result = await checkUser(user);

    res.json(result);
});

router
    .route('/')
    .post(userController.createUser)
    .get(userController.getAllUsers)


    ;


const { checkAllUsers } = require("../services/checkAllUsers");

router.get("/check-all", async (req, res) => {
    try {
        await checkAllUsers();


        res.json({
            success: true,
            message: "All users checked",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});



router
    .route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser);


module.exports = router;


