const { getSocket } = require('../whatsapp');

// JavaScript has setTimeout(), but it does not have a built-in way to "pause" an async function using await so sleep function is made
function sleep(ms) {
    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );
}

async function sendMessage(whatsappNumber, message) {
    const sock = getSocket();

    if (!sock) {
        throw new Error('WhatsApp client is not connected');
    }

    const jid = `${whatsappNumber}@s.whatsapp.net`;

    let attempt = 0;

    while (attempt < 3) {
        try {
            await sock.sendMessage(jid, {
                text: message,
            });

            return true;
        } catch (error) {
            attempt++;

            console.error(
                `WhatsApp attempt ${attempt} failed`,
                error.message
            );

            // Exponential backoff
            // It's a retry strategy where the waiting time increases after each failure exponentially.
            if (attempt < 3) {
                await sleep(
                    Math.pow(2, attempt) * 1000
                );
            }
        }
    }

    throw new Error(
        "Failed to send WhatsApp message after 3 attempts"
    );
}

module.exports = {
    sendMessage,
};
