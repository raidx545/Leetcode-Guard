const { sendAnnouncement } = require('../services/announcementService')



exports.annoucenment = async (req, res) => {
    const { message } = req.body;

    const result =
        await sendAnnouncement(message);

    res.json(result);
}