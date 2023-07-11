const express = require('express');
const app = express();
const colors = require('colors');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');

app.use(cors());

var server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods:["GET","POST"]
    }
})

io.on("connection", (socket) => {
    console.log(socket.id);
    console.log("Hello Buddies");
    socket.on('joinRoom', room => { socket.join(room); })
    socket.on('newMessage', ({ newMessage, room }) => {
        // console.log(newMessage);
        io.in(room).emit("getLatestMessage", newMessage);
    })
})



app.get('/', (req, res) => {
    res.send("Hey My EUi !! ")
})

server.listen(3001,console.log(`\nServer Listening at http://localhost:3001\n`.underline.bold.italic.brightBlue))