const axios = require("axios");


// JavaScript has setTimeout(), but it does not have a built-in way to "pause" an async function using await so sleep function is made
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
            // 429 is use to identify rate limit like if user frequently sending request it will limit it sleep the process for defuaalt 5 second or given parameter
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
            // It's a retry strategy where the waiting time increases after each failure exponentially. if telegram server is having issue it will make attempt wait for 2,4,8.... second exponential
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