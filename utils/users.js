const users = [];

// join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

// get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// user leaves/disconnects
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) 
        return users.splice(index, 1)[0];
}

// get users of a particular room
function getUsersOfRoom(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin, getCurrentUser, userLeave, getUsersOfRoom
}