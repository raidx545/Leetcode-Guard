const axios = require("axios");

function sleep(ms) {
    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );
}

async function sendMessage(chatId, message) {
    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

    let attempt = 0;

    while (attempt < 3) {
        try {
            await axios.post(url, {
                chat_id: chatId,
                text: message,
            });

            return true;
        } catch (error) {
            attempt++;

            const telegramError =
                error.response?.data;

            console.error(
                `Telegram attempt ${attempt} failed`,
                telegramError || error.message
            );

            // Handle Telegram rate limit
            if (
                error.response?.status === 429
            ) {
                const retryAfter =
                    telegramError?.parameters
                        ?.retry_after || 5;

                console.log(
                    `Rate limited. Waiting ${retryAfter}s`
                );

                await sleep(
                    retryAfter * 1000
                );

                continue;
            }

            // Exponential backoff
            if (attempt < 3) {
                await sleep(
                    Math.pow(2, attempt) * 1000
                );
            }
        }
    }

    throw new Error(
        "Failed to send Telegram message after 3 attempts"
    );
}

module.exports = {
    sendMessage,
};