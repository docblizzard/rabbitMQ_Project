const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const router = require('../routes/Routes');
const { saveMessage } = require('../rabbitmq/receive_message');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*"
    }
});

global.io = io;
global.connectedClients = { };

app.use(cors());
app.use(bodyParser.json());
app.use('/', router);

io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    // Handle user login to associate socket with username
    socket.on('message', (message) => {
        saveMessage(message)
        // global.connectedClients[username] = socket.id;
        console.log(`registered with socket id: ${socket.id}`);
    });

    socket.on('disconnect', () => {
        console.log('A client disconnected:', socket.id);
        // Remove disconnected client
        for (let username in global.connectedClients) {
            if (global.connectedClients[username] === socket.id) {
                delete global.connectedClients[username];
                break;
            }
        }
    });
});

const port = process.env.PORT || 3030;

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});