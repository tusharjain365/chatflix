const express = require('express'); // import express
const dotenv=require("dotenv");
const app = express(); // initialize app
const connectDB = require('./config/db');
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const {notFound,errorHandler} = require("./middlewares/errorMiddleware");
const path = require('path');

dotenv.config();
connectDB();

app.use(express.json()) // to accept json data from frontend

// all routes relate work with users
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

//DEPLOYMETNT STARTS HERE
const __dirname1=path.resolve();
if(process.env.NODE_ENV==='production') {
    app.use(express.static(path.join(__dirname1,"/frontend/build")));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
    })
}else {
    app.get('/',(req,res)=>{
        res.send("This is my first node server for chat app");
    });
}

//middlewares to handle anonymous paths
app.use(notFound); 
app.use(errorHandler);
const port =process.env.PORT ||5000;
const server = app.listen(port,console.log(`Server started at ${port}`)); // make the app listen on specified port
const io = require('socket.io')(server, {
    pingTimeout:60000, // waiting time before goes off 
    cors: {
//         origin:'http://localhost:3000'
        origin:'https://chatflix.onrender.com'
    }
})
io.on("connection",(socket)=>{
    console.log("Connected to Socket");
    socket.on('setup',(userData)=>{ 
        socket.join(userData._id);
        socket.emit("connected");
    })
    socket.on('join chat',(room)=>{
        socket.join(room);
    })
    socket.on('typing',(room)=> {
        socket.in(room).emit('typing');
    });
    socket.on('stop typing',(room)=>socket.in(room).emit('stop typing'));
    socket.on('new message',(message)=>{
        let chat = message.chat;
        if(!chat.users) return console.log('No users find in chat');
        chat.users.forEach(user => {
            if(user._id === message.sender._id) return ;
            socket.in(user._id).emit('message received',message);
        });
    })
});
