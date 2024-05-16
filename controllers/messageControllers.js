const { emitMessage } = require('../rabbitmq/emit_message.js');
const { receiveMessage } = require('../rabbitmq/receive_message.js');

async function sendMessage(req, res) {
    try {
        const { exchange, severity, message, recipient } = req.body;
        await emitMessage(exchange, severity, message, recipient);

        return res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getMessage(req, res) {
    try {
        const { recipient } = req.body;
        await receiveMessage(recipient);

        return res.status(200).json({ success: true, message: 'Message sent successfully' });
    }
    catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { sendMessage, getMessage };