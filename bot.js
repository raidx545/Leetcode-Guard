const dotenv = require('dotenv')
dotenv.config();
const User = require('./models/User')
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(
    process.env.BOT_TOKEN,
    { polling: true }
);

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        `Welcome to Leetcode Streak Guard Bot😊. Happy Coding!

Your Chat ID is:

${msg.chat.id}`
    );
});

bot.onText(
    /\/subscribe/,
    async (msg) => {
        try {
            const chatId = String(
                msg.chat.id
            );

            const user =
                await User.findOne({
                    telegramChatId: chatId
                });

            if (!user) {
                return bot.sendMessage(
                    chatId,
                    "❌ You are not registered."
                );
            }

            user.isActive = true;

            await user.save();

            bot.sendMessage(
                chatId,
                "✅ Reminders enabled."
            );

        } catch (error) {
            console.error(error);
        }
    }
);

bot.onText(
    /\/unsubscribe/,
    async (msg) => {
        try {
            const chatId = String(
                msg.chat.id
            );

            const user =
                await User.findOne({
                    telegramChatId: chatId
                });

            if (!user) {
                return bot.sendMessage(
                    chatId,
                    "❌ You are not registered."
                );
            }

            user.isActive = false;

            await user.save();

            bot.sendMessage(
                chatId,
                "Reminders disabled. To start again You can subscribe again!"
            );

        } catch (error) {
            console.error(error);
        }
    }
);

module.exports = bot;