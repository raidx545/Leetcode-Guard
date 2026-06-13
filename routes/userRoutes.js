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
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();





// router
//     .route('/')
//     .post(userController.createUser)
//     .get(userController.getAllUsers);








router
    .route('/:id')
    .get(adminAuth, userController.getUser)
    .delete(adminAuth, userController.deleteUser);


module.exports = router;


