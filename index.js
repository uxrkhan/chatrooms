const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chatrooms Bot';

// Run when client connects
io.on('connection', socket => {
    console.log('New WS Connection...');

    // emit welcome message (to single client)
    socket.emit('message', formatMessage(botName, 'Welcome to Chatrooms!'));

    // broadcast when a user connects (to all users except the connecting user)
    socket.broadcast.emit('message', 'A user has joined the chat');

    // runs when client disconnects 
    socket.on('disconnect', () => {
        // to all users in general
        io.emit('message', formatMessage(botName, 'A user has left the chat'));
    })

    // listen for message sent from client
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('user', msg));
    })
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
