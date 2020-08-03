const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getUsersOfRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chatrooms Bot';

// Run when client connects
io.on('connection', socket => {
    // when a client joins the room
    socket.on('joinRoom', ({username, room}) => {
        
        // join the new user to the respective room
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // emit welcome message (to single client)
        socket.emit('message', formatMessage(botName, 'Welcome to Chatrooms!'));

        // broadcast when a user connects (to all users except the connecting user)
        // "to(user.room) means to all the members of a particular room"
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName, `${user.username} has joined the chat.`));
        
    });
    
    // listen for message sent from client
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // runs when client disconnects 
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat.`));
        }
    })

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
