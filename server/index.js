// const Server = require("socket.io")
import http from "http"
import { Server } from "socket.io"
// import { createServer } from "http"
import { v4 as uuidV4 } from "uuid"
import dotenv from "dotenv"
import { findAllSessions, findSession, saveSession } from "./sessionStorage.js"
import { findMessagesForUser, saveMessage } from "./messageStorage.js"
import path from "path"
import express from "express"
import { fileURLToPath } from "url"
import cors from "cors"
import { mongoConn } from "./config/mongoDbConnection.js"
import { User } from "./models/userSchema.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const expressApp = express()


const httpServer = http.createServer(expressApp)

// if(process.env.NODE_ENV !== "PRODUCTION"){
    dotenv.config({path:"server/.env"})
// }

const port = process.env.PORT || 4999
expressApp.use(cors())

const io = new Server(httpServer, {
    cors: {
        // origin: "http://localhost:4999", // frontend url
        origin: "https://chatapp-server-pratap.vercel.app", // frontend url
        // https://wechat-free.herokuapp.com/

        methods: ["GET", "POST"]
        
    }
})

// const io = new Server(httpServer)


expressApp.use(express.static(path.join(__dirname,"../chatapp/build")))
expressApp.get("/", (req, res)=>{
if(process.env.NODE_ENV){
    expressApp.get("/",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"../chatapp/build/index.html"))
    })
}
})

// middleware

// 3,24,000
// 40
// 8,100
// 

io.use(async(socket, next) => { /// step 1
//     // initially this middleware will call after requesting connection from frontend
//     // connection request will carry username with socket from frontend
    const sessionId = socket.handshake.auth.sessionId // from frontend, if session found in localStorage, then this connection will call with session id
// console.log("middleware socket", socket.handshake)


    if (sessionId) {

        const session = findSession(sessionId)

        if (session) {

            socket.sessionId = sessionId
            socket.userId = session.userId
            socket.username = session.username

            return next() // this next middleware will call socket connection
        }
        else {
            return next(new Error("Invalid session !"))
        }
    }

    const username = socket.handshake.auth.username // comming from client side

    if (!username || username === undefined) {
        return next(new Error("Invalid Username"))
    }

    socket.username = username
    socket.userId = uuidV4()
    socket.sessionId = uuidV4() // set session id

    
    next(); // is middleware ke baad sicket connection call hoga
})

// 7900 - 5050 = 2850 + 3900

function getMessagesForUser(userId){

    const messages = []

    findMessagesForUser(userId).forEach((message)=>{
        messages.push(message)
    })
    return messages
}


io.on("connection", async (socket) => { /// step 2

    // if socket rec any username then it will work

//     console.log("user 1")

//     const isUsername = await User.findOne({name:socket.handshake.auth.username})

//     console.log("user 2")

//     if(isUsername){
//         return next(new Error("user name already exist !"))
//     }

//     console.log("user 3")

//     if(!isUsername){
//      await User.create({
//         name:socket.handshake.auth.username,
//         email:"pratap@gmail6.com",
//         phone:8287889121,
//         gender:"male",
//         age:27,
//         password:"123456789"
//     })
// }

//     console.log("user 2")


    // save session when connection rec
    saveSession(socket.sessionId, { // step 2.1
        userId: socket.userId,
        username: socket.username,
        connected: true
    });

    socket.join(socket.userId); // step 2.2

    // store all connected users
    const users = []

    // // getting all messages for a particular user
    // console.log("98",getMessagesForUser(socket.userId))

    // storing all users
    findAllSessions().forEach((session) => { // step 2.3
        // console.log("105",getMessagesForUser(session.userId))
        
        if (session.userId !== socket.userId) { // store all users except self
          users.push({
                userId: session.userId,
                username: session.username,
                connected: session.connected,

                // messages : getMessagesForUser(session.userId) || [] // seperate step 
            })
        }
        
    });

    // io.of("/").sockets.forEach(u => { // to get all connected user, use io.of("/").sockets
    //     users.push({ username: u.username, userId: u.userId })
    // });

    // send all users 
    socket.emit("users", users); // step 2.4

    // // socket event
    socket.emit("session", { // step 2.5  // ye session sirf self k liye hai taki refresh hone ke baad bhi log in rhe
        userId: socket.userId,
        username: socket.username,
        sessionId: socket.sessionId
    }); // now sending user details with connection success

    // for all connected users, when one user didnt notify of other joined user
    socket.broadcast.emit("users connected", { // step 2.9 
        userId: socket.userId,
        username: socket.username 
    });

    // // send new message
    // socket.on("new message", (message) => {
    //     socket.broadcast.emit("new message", {
    //         userId: socket.userId,
    //         username: socket.username,
    //         message
    //     });
    // });

     // send private message
    socket.on("private message", ({content, to, time}) => {
        
        const message = {
            content ,
            to,
            username : socket.username,
            from : socket.userId,
            time
        }
        socket.to(to).emit("private message", message);
        saveMessage(message);
    });

    // get user messages
    socket.on("user messages", ({userId, username})=>{
        // console.log("selected user to see mssgs", userId )
        // const userMessages = getMessagesForUser(socket.userId);
        
        const messageFrom = getMessagesForUser(userId).filter((m)=>{
           return m.to === socket.userId || m.from === socket.userId
        })

        socket.emit("user messages", {
            userId,
            username,
            to: socket.userId,
            // messages : userMessages.get(userId) || [] // if messages available then will send messages else it will send an empty array
            messages : messageFrom,
            
        })
    })

    socket.on("user typing", ({typingStatus, userId, to})=>{
       socket.to(to).emit("user typing", {
        typingStatus, 
        userId, 
        to
       })
    })

    // user disconnect
    socket.on("disconnect", async () => { // setp last it will automatically call when user closed the tab
        
        const matchingSocket = await io.in(socket.userId).allSockets();
        const isDisconnected = matchingSocket.size === 0; 

        if (isDisconnected) {
            // notify other users
            socket.broadcast.emit("user disconnected", {
                userId : socket.userId,
                username : socket.username
            });
            // update the connection status of the session
            saveSession(socket.sessionId, {
                userId : socket.userId,
                username : socket.username,
                connected : socket.connected
            });
        }
    });
})

// mongoConn(process.env.MONGO_CONN)
// mongoConn("mongodb+srv://pro:18May1994@cluster0.5qgqh.mongodb.net/wechat-free?retryWrites=true&w=majority")
mongoConn("mongodb+srv://pro:pro@cluster0.5qgqh.mongodb.net/chat?retryWrites=true&w=majority")
// mongoConn("mongodb://crud:crud@cluster0-shard-00-00.5qgqh.mongodb.net:27017,cluster0-shard-00-01.5qgqh.mongodb.net:27017,cluster0-shard-00-02.5qgqh.mongodb.net:27017/chat?ssl=true&replicaSet=atlas-5875s3-shard-0&authSource=admin&retryWrites=true&w=majority")









httpServer.listen(port, () => {
    console.log(`connected successfully on http://localhost:4999`)
})
