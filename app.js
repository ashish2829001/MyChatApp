const express = require('express');
const path = require('path');
const http = require('http'); 

const { addUser , removeUser , getUser , getUsersInRoom } = require('./public/js/users.js');

const { obj } = require('./public/js/object.js');

const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectory = path.join(__dirname+"/public");
app.use(express.static(publicDirectory));

var count = parseInt(0); 

io.on('connection',(socket)=>{

    socket.on('join',({ username,room },cb)=>{

        const {error,user} = addUser({id: socket.id , username , room});
        if(error){
            return cb(error);
        }
        
        socket.join(user.room);

        socket.emit('message',`${user.username}`);
        socket.broadcast.to(user.room).emit('message1',`${user.username} has joined now!`);
        count = count+1;
        io.to(user.room).emit('countUpdated',count);
        
        io.to(user.room).emit('usersData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        cb();

    })


    socket.on('sendMessage',(data,cb)=>{

        const user = getUser(socket.id);

        const userObject = {
            text : data,
            username: user.username,
            room : user.room
        }

        socket.emit('messageToMe',userObject);

        socket.broadcast.to(user.room).emit('messageResponse',userObject);
        cb('Delivered');
    })
    

    socket.on('sendLocation',(coords)=>{
        const user = getUser(socket.id);

        const send_obj = {
            text : `http://google.com/maps?q=${coords.latitude},${coords.longitude}`,
            username: user.username,
            room : user.room
        }

        socket.emit('locationToMe',send_obj);
            
        socket.broadcast.to(user.room).emit('locationResponse',send_obj);
    })

    
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);

        if(user){
            count = count-1;
            socket.broadcast.to(user.room).emit('countUpdated',(count));
            socket.broadcast.to(user.room).emit('message1',`${user.username} left!`);
        
            io.to(user.room).emit('usersData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    })
})



const port = process.env.PORT || 3001;
server.listen(port,()=>{
    console.log('Server started successfully at port : '+port);
})