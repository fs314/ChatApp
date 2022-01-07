const users = []

//Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room}
    
    // push user to state
    users.push(user)

    return user;
}

//Get current user
function getCurrentUser(id) {ù
    console.log(users, 'getCurrentUser')
    return users.find(user => user.id === id)
}

//User leaves chat
function userLeave(id) {
    const index = users.find(user => user.id === id)

    if(index !== -1) {
        console.log('HERE ', users.splice(index, 1))
        return users.splice(index, 1)[0];
    }
}

// Get room users 
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {userJoin, getCurrentUser, userLeave, getRoomUsers}