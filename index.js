const express=require('express')
const http=require("http")
const {Server}=require('socket.io')
// const userModel=require('./models/users')
// const messageModel=require('./models/message')
const cors=require("cors")

const app=express()
const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173"
    }
})

app.use(cors())

//web sockets
const roomName="chat-room"
io.on("connection",client=>{

    //getting the name and joining the room
    client.on("name",async (name)=>{
        // const newUser=await userModel.create({
        //     name,
        //     user_id:client.id
        // })

        client.join(roomName)
    io.to(roomName).emit('join-message',`${name} joined`)
    })

    //getting the message form client
    client.on("send-message",async (message)=>{
        // const newMessage=await messageModel.create({
        //     message,
        //     sender_id:client.id
        // })

        io.to(roomName).emit("message",{message:message,sender_id:client.id})
    })

    //sending the message on disconnect
    client.on('disconnect',async ()=>{
        // const deletedUser=await userModel.findOneAndDelete({user_id:client.id})
        io.to(roomName).emit("leave-message")
    })
    
})

      //Routes for routing
app.get('/',(req,res)=>{
    res.send("home page ho hai")
})

server.listen(1111,()=> console.log("server is live"))



