const {
    updateAllUsers
} = require("../services/dailyUpdateService");

const {
    checkAllUsers
} = require("../services/checkAllUsers");

exports.dailyUpdate = async (req, res) => {

    try {

        if (
            req.headers["x-cron-secret"] !== process.env.CRON_SECRET
        ) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        console.log("Running Daily Update");

        await updateAllUsers();

        res.status(200).json({
            success: true,
            message: "Daily update completed"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.sendReminder = async (req, res) => {

    try {

        if (
            req.headers["x-cron-secret"] !== process.env.CRON_SECRET
        ) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        console.log("Running Reminder Job");

        await checkAllUsers();

        res.status(200).json({
            success: true,
            message: "Reminder job completed"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};