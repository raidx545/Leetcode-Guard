const dotenv = require('dotenv')
dotenv.config();
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
    process.env.BOT_TOKEN,
    { polling: true }
);

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `Welcome!

Your Chat ID is:

${msg.chat.id}`
    );
});

module.exports = bot;