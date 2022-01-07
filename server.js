const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/Users')
const botname = 'Chatcord Bot'

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./utils/messages')

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//run when client connects
io.on('connection', socket => {
    console.log('new websocket connection... ')

    socket.on('joinRoom', ({username, room}) => {
        
        const user = userJoin(socket.id, username, room)
        console.log( 'USERR')
        socket.join(user.room)

        //sends to the single client
        socket.emit('message', formatMessage(botname,' Welcome here!'))

        //Broadcast when a user connects - notifies everyone except user connecting
        socket.broadcast.to(user.room).emit('message', formatMessage(botname,  ` ${user.username} has joined the chat ` ));

        //ALL client (including connecing user)
        //io.emit()

        //Send users and Room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
    

    //Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        console.log(user, ' here')

        if(user) {
            io.to(user.room).emit('message', formatMessage(botname, `${user.username} has left the chat`))

            //Send users and Room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })

    //Listen for chatMessage
    socket.on('chatMessage', (msg) => {

        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(`${user.username}`, msg))
    })
})
const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log('Server up and running on ', PORT))