const { emitMessage } = require('../rabbitmq/emit_message.js');

async function sendMessage(req, res) {
    try {
        const { exchange, severity, message } = req.body;
        await emitMessage(exchange, severity, message);

        return res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { sendMessage };