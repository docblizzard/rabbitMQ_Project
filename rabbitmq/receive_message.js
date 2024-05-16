#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const sqlite3 = require('sqlite3').verbose();

async function receiveMessage(recipient) {

    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            var queue = recipient;
            
            channel.assertQueue(queue, {
                durable: false
            });
            
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
            
            channel.consume(queue, function(msg) {
                console.log(" [x] Received %s", msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
}

function saveMessage(message) {
    const db = new sqlite3.Database('mydatabase.db');
    const timestamp = new Date().toISOString();
    db.run("INSERT INTO message (content, sender, recipient, date) VALUES (?, ?, ?, ?)",
        [message.content, message.sender, message.recipient, timestamp],
        function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`A message has been inserted with ID ${this.lastID}`);
        });
}

module.exports = { receiveMessage, saveMessage };