#!/usr/bin/env node

const amqp = require('amqplib');

async function emitMessage(exchange, severity, message) {
    try {
        var connection = await amqp.connect('amqp://localhost');
        var channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'direct', { durable: false });
        await channel.publish(exchange, severity, Buffer.from(message));
        // await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify("hello")));
        
        console.log(` [x] Sent ${severity}: '${message}'`);
        
        setTimeout(async () => {
            await connection.close();
            console.log("Connection closed.");
        }, 500);
    } catch (error) {
        console.error("Error occurred:", error);
        process.exit(1);
    }
}

module.exports = { emitMessage };