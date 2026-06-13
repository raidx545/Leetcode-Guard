const express = require('express');
const userController = require('../controllers/userController');
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();







router
    .route('/:id')
    .get(adminAuth, userController.getUser)
    .delete(adminAuth, userController.deleteUser);


module.exports = router;


