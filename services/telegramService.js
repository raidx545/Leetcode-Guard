const axios = require("axios");

const sendMessage = async (chatId, message) => {
    try {
        const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

        await axios.post(url, {
            chat_id: chatId,
            text: message,
        });

        return true;
    } catch (error) {
        console.error(error.response?.data || error.message);
        return false;
    }
};

module.exports = {
    sendMessage,
};