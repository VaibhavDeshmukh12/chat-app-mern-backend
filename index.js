const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.route');
const messageRoutes = require('./routes/message.route');
const socket = require('socket.io');


const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use('/api/auth',userRoutes);
app.use('/api/messages',messageRoutes);


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Db connection successfull");
}).catch((error)=>console.log('error :>> ', error.message))

const server = app.listen(process.env.PORT || 5000,()=>{
    console.log("Server Listening on port: ",process.env.PORT||5000);
})

const io = socket(server,{
    cors:{
        origin:"http://localhost:3000" || process.env.FRONTEND,
        credential: true
    }
});

global.onlineUsers = new Map();

io.on('connection',(socket)=>{
    global.chatSocket = socket;
    socket.on('add-user',(userId)=>{
        onlineUsers.set(userId,socket.id);
    });

    socket.on('send-msg',(data)=>{
        // console.log({data});
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",data.message);
        }
    })
});