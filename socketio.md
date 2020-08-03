# Socket.io 

## In index.js (backend server)

- Create a normal static server with express and listen to it with http module
- create socketio instance with server

```js
    // server side

    const express = require('express');
    const path = require('path');
    const http = require('http');
    const socketio = require('socket.io');

    const app = express();
    const server = http.createServer(app);

    const io = socketio(server);
    io.on('connection', socket => {
        // every time a client connects, do this...
        console.log('New websocket connection.');
        socket.emit('message', 'Welcome to socket.io app!');
    })

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('server started on port ' + PORT));
```

## In main.js (frontend JS)

- In the html file (where sockets will be used), inlcude this js script
- In the fronted js file (main.js), use socket.on() to do whatever you want with socket.io

```js
    // client side

    const socket = io();

    // display the data passed by server with the name 'message'
    socket.on('message', msg => {
        console.log(msg);
    })
```