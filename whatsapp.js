const dotenv = require('dotenv');
dotenv.config();

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const User = require('./models/user');
const { getTotalSolved } = require('./services/leetcodeService');

let sock = null;
const processedMessages = new Set();

async function startWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
        version,
        auth: state,
        syncFullHistory: false,
        connectTimeoutMs: 60000,
        fireInitQueries: false,
        markOnlineOnConnect: false,
        shouldIgnoreJid: (jid) => {
            return jid?.endsWith('@broadcast') || jid?.endsWith('@g.us');
        },
    });

    // Save credentials whenever they update
    sock.ev.on('creds.update', saveCreds);

    // Handle connection updates
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // Display QR code in terminal when available
        if (qr) {
            console.log('\n[WhatsApp] Scan this QR code with your WhatsApp app:\n');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect =
                statusCode !== DisconnectReason.loggedOut && statusCode !== 409;

            console.log('[WhatsApp] Connection closed. Status:', statusCode, 'Reconnecting:', shouldReconnect);

            if (shouldReconnect) {
                // Close old socket cleanly before reconnecting
                try { sock.end(); } catch (_) {}
                // Wait before reconnecting to avoid rapid loops
                await new Promise(resolve => setTimeout(resolve, 3000));
                startWhatsApp();
            } else if (statusCode === DisconnectReason.loggedOut) {
                console.log('[WhatsApp] Logged out. Please delete auth_info/ and restart to re-authenticate.');
            }
        } else if (connection === 'open') {
            console.log('[WhatsApp] Connected successfully!');
        }
    });

    // Handle incoming messages (chat commands)
    sock.ev.on('messages.upsert', async ({ messages }) => {
        for (const msg of messages) {
            // Debug: log every incoming message
            console.log('[WhatsApp] Message received from:', msg.key.remoteJid, 'fromMe:', msg.key.fromMe);

            // Skip messages sent by us, or messages without text
            if (msg.key.fromMe) continue;

            // Skip duplicate messages
            const msgId = msg.key.id;
            if (processedMessages.has(msgId)) continue;
            processedMessages.add(msgId);
            // Keep the set from growing forever
            if (processedMessages.size > 1000) processedMessages.clear();

            const text = msg.message?.conversation
                || msg.message?.extendedTextMessage?.text
                || '';

            if (!text.startsWith('!')) continue;

            const senderJid = msg.key.remoteJid;
            const whatsappNumber = senderJid.replace('@s.whatsapp.net', '').replace('@lid', '');

            const [command, ...args] = text.trim().split(/\s+/);

            try {
                switch (command.toLowerCase()) {
                    case '!start':
                        await sock.sendMessage(senderJid, {
                            text: `Welcome to LeetCode Streak Guard! 😊 Happy Coding!\n\nAvailable commands:\n!register <username> <phone_number> - Register your LeetCode account\n!subscribe <phone_number> - Enable reminders\n!unsubscribe <phone_number> - Disable reminders\n!help - Show this message`
                        });
                        break;

                    case '!register':
                        await handleRegister(senderJid, args[0], args[1]);
                        break;

                    case '!subscribe':
                        await handleSubscribe(senderJid, args[0] || whatsappNumber);
                        break;

                    case '!unsubscribe':
                        await handleUnsubscribe(senderJid, args[0] || whatsappNumber);
                        break;

                    case '!help':
                        await sock.sendMessage(senderJid, {
                            text: `📋 LeetCode Streak Guard Commands:\n\n!start - Welcome message\n!register <username> <phone_number> - Register your LeetCode account\n!subscribe <phone_number> - Enable reminders\n!unsubscribe <phone_number> - Disable reminders\n!help - Show this help message`
                        });
                        break;

                    default:
                        await sock.sendMessage(senderJid, {
                            text: '❓ Unknown command. Type !help for available commands.'
                        });
                }
            } catch (error) {
                console.error('[WhatsApp] Command error:', error.message);
            }
        }
    });

    return sock;
}

async function handleSubscribe(jid, whatsappNumber) {
    const user = await User.findOne({ whatsappNumber });

    if (!user) {
        return sock.sendMessage(jid, {
            text: '❌ You are not registered. Please register via the API first.'
        });
    }

    user.isActive = true;
    await user.save();

    await sock.sendMessage(jid, {
        text: '✅ Reminders enabled.'
    });
}

async function handleUnsubscribe(jid, whatsappNumber) {
    const user = await User.findOne({ whatsappNumber });

    if (!user) {
        return sock.sendMessage(jid, {
            text: '❌ You are not registered.'
        });
    }

    user.isActive = false;
    await user.save();

    await sock.sendMessage(jid, {
        text: 'Reminders disabled. To start again you can subscribe again!'
    });
}

async function handleRegister(jid, leetcodeUsername, phoneNumber) {
    if (!leetcodeUsername || !phoneNumber) {
        return sock.sendMessage(jid, { text: '❌ Please provide both your LeetCode username and phone number (with country code).\nExample: !register leetcode_user 919876543210' });
    }

    // Clean up phone number - remove +, spaces, dashes
    const whatsappNumber = phoneNumber.replace(/[^0-9]/g, '');

    if (whatsappNumber.length < 10) {
        return sock.sendMessage(jid, { text: '❌ Invalid phone number. Use country code + number.\nExample: 919876543210 (91 = India)' });
    }

    try {
        const existingWhatsApp = await User.findOne({ whatsappNumber });
        if (existingWhatsApp) {
            return sock.sendMessage(jid, { text: '❌ This WhatsApp number is already registered.' });
        }

        const existingUser = await User.findOne({ leetcodeUsername: leetcodeUsername.toLowerCase() });
        if (existingUser) {
            return sock.sendMessage(jid, { text: '❌ This LeetCode username is already registered.' });
        }

        const lcData = await getTotalSolved(leetcodeUsername);
        
        await User.create({
            leetcodeUsername,
            whatsappNumber,
            lastSolvedCount: lcData.totalSolved,
            isActive: true
        });

        await sock.sendMessage(jid, {
            text: `✅ Successfully registered!\n\nUsername: ${leetcodeUsername}\nPhone: ${whatsappNumber}\nTotal Solved: ${lcData.totalSolved}\n\nYou will now receive daily reminders if you haven't solved a problem! 🎉`
        });
    } catch (error) {
        await sock.sendMessage(jid, { text: `❌ Registration failed: ${error.message}` });
    }
}

function getSocket() {
    return sock;
}

module.exports = { startWhatsApp, getSocket };
