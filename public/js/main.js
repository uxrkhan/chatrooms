const chatForm = document.getElementById('room-chat-form');
const chatStream = document.querySelector('.room-stream');

const socket = io();

// message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // scroll down
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

    // emit message to server
    socket.emit('chatMessage', msgText);
});

// function to output message to DOM
/* we could have used a view engine like handlebars/ejs or a frontend
framework like React.js but we decided to use DOM */
function outputMessage(msgObject) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${msgObject.username} <span>${msgObject.time}</span></p>
    <p class="message-content">${msgObject.text}</p>`;

    document.querySelector('.room-stream').appendChild(div);
}