// middleware/adminAuth.js

const adminAuth = (req, res, next) => {
    const token = req.headers["x-admin-token"];

    if (token !== process.env.ADMIN_TOKEN) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized"
        });
    }

    next();
};

module.exports = adminAuth;