const express = require('express');
const userController = require('../controllers/userController');
const sendMessage = require('../services/telegramService')

const router = express.Router();

router
    .route('/')
    .post(userController.createUser)
    .get(userController.getAllUsers)


    ;


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


router
    .route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser);


module.exports = router;


