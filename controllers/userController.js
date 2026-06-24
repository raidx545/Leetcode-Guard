const User = require("../models/user");
const { getTotalSolved } = require("../services/leetcodeService");


exports.register = async (req, res) => {
    try {
        const {
            leetcodeUsername,
            whatsappNumber
        } = req.body;

        if (!leetcodeUsername || !whatsappNumber) {
            return res.status(400).json({
                status: "fail",
                message: "LeetCode username and WhatsApp number are required"
            });
        }

        const lcData = await getTotalSolved(
            leetcodeUsername
        );

        const existingUser = await User.findOne({
            leetcodeUsername: leetcodeUsername.toLowerCase()
        });

        if (existingUser) {
            return res.status(400).json({
                status: "fail",
                message: "LeetCode username already registered"
            });
        }

        const existingWhatsApp = await User.findOne({
            whatsappNumber
        });

        if (existingWhatsApp) {
            return res.status(400).json({
                status: "fail",
                message: "WhatsApp number already registered"
            });
        }

        const user = await User.create({
            leetcodeUsername,
            whatsappNumber,
            lastSolvedCount: lcData.totalSolved,
            isActive: true
        });

        res.status(201).json({
            status: "success",
            data: {
                user
            }
        });

    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
};



// Getting all user and single user is not done due to security purpose will be done when needed

exports.createUser = async (req, res) => {
    try {
        const user = await User.create({
            leetcodeUsername,
            whatsappNumber,
            lastSolvedCount: lcData.totalSolved,
            isActive: true
        });
        res.status(201).json({
            status: 'success',
            data: {
                user
            }
        });

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: 'succes',
            results: users.length,
            data: {
                users
            }
        });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
}



exports.getUser = async (req, res) => {

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        })


    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: 'User not found'
        });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

