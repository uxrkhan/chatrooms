const chatForm = document.getElementById('room-chat-form');
const chatStream = document.querySelector('.room-stream');
const roomName = document.getElementById('room-name');
const roomUsers = document.getElementById('users-list');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

// join room
socket.emit('joinRoom', { username, room });

// get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputRoomUsers(users);
})

// on receiving message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // scroll down after every new message
    chatStream.scrollTop = chatStream.scrollHeight;
});

// message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    // get message text
    const msgText = e.target.elements.msg.value;

    // clear the message field and focus on it
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

    if (msgText.trim() !== '') // refuse only-whitespace messages
        // emit the message
        socket.emit('chatMessage', msgText);
});

// function to output message to DOM
/* we could have used a view engine like handlebars/ejs or a frontend
framework like React.js but we decided to use DOM */
function outputMessage(msgObject) {
    const div = document.createElement('div');
    div.classList.add('message-container');
    if (msgObject.username == username) {
        div.innerHTML = `
            <div class="outgoing-message">
                <p class="meta">You <span>${msgObject.time}</span></p>
                <p class="message-content">${msgObject.text}</p>
            </div>`;
    } else {
        div.innerHTML = `
            <div class="incoming-message">
                <p class="meta">${msgObject.username} <span>${msgObject.time}</span></p>
                <p class="message-content">${msgObject.text}</p>
            </div>`;
    }
    document.querySelector('.room-stream').appendChild(div);
}

// function htmlEscape(str) {
//     return str
//         .replace(/&/g, '&amp;')
//         .replace(/"/g, '&quot;')
//         .replace(/'/g, '&#39;')
//         .replace(/</g, '&lt;')
//         .replace(/>/g, '&gt;');
// }

function outputRoomName(room) {
    roomName.innerText = room;
}

// add users to DOM
function outputRoomUsers(users) {
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerText = user.username;
        roomUsers.appendChild(li);
    })
}