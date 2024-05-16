const { emitMessage } = require('../rabbitmq/emit_message.js');
const { receiveMessage } = require('../rabbitmq/receive_message.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

async function sendMessage(req, res) {
    try {
        const { exchange, severity, message, recipient, sender } = req.body;
        await emitMessage(exchange, severity, message, recipient, sender);
        const timestamp = new Date().toISOString();
        console.log(timestamp);
        db.run("INSERT INTO message (content, recipient, sender, date) VALUES (?, ?, ?, ?)",
            [message, recipient, sender, timestamp],
            function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).json({ error: 'Database error' });
                }
                if (global.io && global.connectedClients[recipient]) {
                    global.io.to(global.connectedClients[recipient]).emit('message', { exchange, severity, message, sender, recipient });
                }
                return res.status(200).json({ success: true, message: 'Message sent successfully' });
            });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getMessage(req, res) {
    try {
        const { recipient } = req.body;
        await receiveMessage(recipient);

        db.run("SELECT * FROM message WHERE recipient = ?", [recipient], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            return res.status(200).json({ success: true, messages: rows });
        });
    }
    catch (error) {
        console.error("Error receiving message:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { sendMessage, getMessage };