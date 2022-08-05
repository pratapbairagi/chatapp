import ChatContainer from "./chatContainer";
import ChatHeader from "./chatHeader";
import ChatInput from "./chatInput";
import "./chatBody.css"
import React, { useCallback, useEffect, useState } from "react"
import ChatBody from "./chatBody";


// task
// - show which users are online/offline
// create css classes // done
// add css class to html // done
// update user connected event ( create a useCallback function)
// and create handleConnectionStatus function
// handle disconnect event on server side
// add user disconnected event on client

// task
// -new message alert
// write css classes
// add css classes to html
// write new mmssg status function
// update private message function
//update select user functioin


// task
// - saving chat messages on server
// messageStorage js on server side
// saveMessage in private message event
// message array inside users 
// emit user messages on client side
// handle user messages event on server side
// handle user messages event on  client side


// const Chat = ({ user, setUser, messages, setMessages, users, setUsers, socket }) => {
const Chat = ({ user, setUser, messages, setMessages, users, setUsers, socket }) => {



    const [selectedUser, setSelectUser] = useState({})
    const [message, setMessage] = useState("")

    const selectUserHandler = (user) => {
        setSelectUser(user)

        socket.emit("user messages", user) // when user selected, messages will be called from socket/server
        
        setMessages([]) // this for sending mssg to the selected user and preventing to send mssg to other users
        handleNewMessageAlertStatus(user.userId, false)
    }


    //       // find user with callback is checking than the same user/userId repeating or not
    const findUser = useCallback(async (userId) => {
        const userIndex = await users.findIndex((user) => user.userId === userId)
        return userIndex >= 0
    }, [users])

    const handleConnectionStatus = useCallback(async (userId, status) => {
        // const userIndex = await users.findIndex((u) => u.userId === userId)

        const modi = await users.filter((ui) => {
            return ui.userId === userId ? ui.connected = status : ui
        })

        setUsers(modi)


        // if (userIndex >= 0) {
        //     console.log("changing user online/offline status", status)
        //   users[userIndex].connected = status

        //   setUser([...users])
        // }
    }, [users, setUsers])

    const userConnected = useCallback(async ({ username, userId }) => {
        if (user.userId !== userId) {
            const userExist = await findUser(userId) // this function is with useCallback to check that wheather user already exist or not
            if (userExist) {
                return handleConnectionStatus(userId, true)
            }
            else {
                const newMessage = { type: "userStatus", username, userId }
                setMessages([...messages, newMessage])
                setUsers([...users, { username, userId, connected: true }])
            }
        }
        //   }, [user, users, findUser, setUsers, handleConnectionStatus, messages, setMessages])
    }, [user, users, setUsers, findUser, handleConnectionStatus, messages, setMessages])


    const userDisconnected = useCallback(({ userId }) => {
        return handleConnectionStatus(userId, false)
    }
        , [handleConnectionStatus])


        // handle newMessageAlertStatus
    const handleNewMessageAlertStatus = useCallback((userId, status) => {
        const findIndex = users.findIndex((fu) => fu.userId === userId)

        if (findIndex >= 0) {
            if(status === true){
                users[findIndex].hasNewMessage=users[findIndex].hasNewMessage===undefined ? 0 : users[findIndex].hasNewMessage
                users[findIndex].hasNewMessage++

                setUsers([...users])
            }
            else{
                users[findIndex].hasNewMessage=0
                setUsers([...users])
            }
            
        }
    }, [users, setUsers])

    //   rec private mssg callback
    const privateMessage = useCallback(({ content, from, to, username }) => {

        if (selectedUser.userId) {
            // if selected user
            if (selectedUser.userId === from) {
                setMessages([...messages, {
                    message: content,
                    username,
                    userId: from,
                    // username: from.userId,
                    to
                }])
            handleNewMessageAlertStatus(from, false)

            }
            else{
                handleNewMessageAlertStatus(from, true)
            }
            // if not selected user
        }
        else{
            handleNewMessageAlertStatus(from, true)
        }

        // setMessages([...messages, {
        //     userId: from,
        //     username: from.userId,
        //     message: content
        // }])
    }, [messages, setMessages, handleNewMessageAlertStatus, selectedUser])

    // particular or selected user private messages
    const userMessages = useCallback(({messages, seen})=>{
        // we are receiving these names inside messages {content, from}
        // but our message format has {message, userId}

        const chatMessages = []

        messages.forEach(({content, from, time})=>{
            chatMessages.push({
                message : content,
                username : socket.username,
                userId : from,
                time,
                seen
            })
        })
        setMessages([...chatMessages])
    }, messages, setMessages)

    useEffect(() => {
        // all users joined noti to all/ remain users
        socket.on("users connected", (user) => {
            // if (user.userId !== userId) {

            //   const userExist = findUser(userId) // this function is with useCallback to check that wheather user already exist or not
            //   if (!userExist) {
            //     const newMessage = { type: "userStatus", username, userId }
            //     setMessages([...messages, newMessage])
            //     setUsers([...users, { username, userId, connected : true }])
            //   }
            // }
            return userConnected(user)
        })

        //       // user disconnected
        socket.on("user disconnected", (user) => userDisconnected(user)) // step last when user closed the tab, server will send this event

        //     // rec new messages
        //     socket.on("new message", ({ userId, username, message }) => {
        //      setMessages([...messages, {
        //        type: "message",
        //        userId,
        //        username,
        //        message
        //      }])
        //    })

        //     // rec private messages
        socket.on("private message", (message) => privateMessage(message))

        // rec particular user private messages
        socket.on("user messages", (messages)=> userMessages(messages))

    }, [socket, users, userConnected, userDisconnected, privateMessage, userMessages])


    //       // send new message
    function submitMessage() {

        // socket.emit("new message", message)
        socket.emit("private message", {
            content: message,
            to: selectedUser.userId,
            time : Date.now()
        })


        const newMessage = {
            userId: user.userId,
            username: user.username,
            message,
            time: Date.now()
        }

        setMessages([...messages, newMessage])
        setMessage("")
    }

    // typing status

    useEffect(()=>{
        if(message.length>0){
            socket.emit("user typing", {
                typingStatus: true ,
                userId : socket.userId,
                to: selectedUser.userId
            })
            setTimeout(()=>{
                socket.emit("user typing", {
                    typingStatus: false,
                    userId : socket.userId,
                    to: selectedUser.userId
                })
            },7000)
        }
        else{
            socket.emit("user typing", {
                typingStatus: false,
                userId : socket.userId,
                to: selectedUser.userId
            })
        }
    },[message])

    const [typing, setTyping] = useState(false)

    useEffect(()=>{
        socket.on("user typing", ({typingStatus, userId, to})=>{
            if(typingStatus){
                setTyping(true)
            }
            else{
                setTyping(false)
            }
        })
    },[typing])


    return (
        <ChatContainer>

            <div className="d-flex flex-column col-3 col-lg-4 col-xl-4 p-0 header_leftSide" style={{ height: "100vh" }}>
                <div className="col col-12 p-0 header_selfContainer">
                    <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" />
                    <span className="text-success">{user.username}</span>
                    
                </div>
                <div className="col col-12 p-0 body_usersConnectedContainer">
                    <div className="allUsersContainer" >
                        <span>Connected Users</span>
                        <div className="users">
                            {
                                users.length === 0 ?
                                    <span>No User Connected</span>
                                    :
                                    users.map((u, i) => {

                                        return (
                                            <div onClick={() => selectUserHandler(u)} className="usersConnectedContainer" key={i + 1}>

                                                <div className="image">
                                                    <div className={`${u.connected ? "online" : "offline"}`}></div>
                                                    <img style={{ width: "2rem", height: "2rem", borderRadius: "50%" }} src={`https://bootdey.com/img/Content/avatar/avatar${i + 3}.png`} alt="avatar" />
                                                </div>
                                                <div className="connectedUsersName">{u.username}</div>
                                                <div className={`${u.hasNewMessage > 0 ? "newMssgAlert" : null}`} style={{fontSize:"50%", color:"white"}}>
                                                        {u.hasNewMessage > 0 && "New Message"}
                                                </div>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    </div>
                </div>
            </div>
            {selectedUser.username &&
                <div className="d-flex flex-column col-9 col-lg-8 col-xl-8 p-0" style={{ height: "100vh" }}>

                    <ChatHeader user={selectedUser} typing={typing}/>
                    <ChatBody users={users} user={user} messages={messages} selectedUser={selectedUser} />
                    <ChatInput setMessage={setMessage} message={message} submitMessage={submitMessage} />
                </div>
            }

            {/* <ChatHeader user={user.username} /> */}
            {/* <ChatBody users={users} user={user} messages={messages} /> */}
            {/* <ChatInput setMessage={setMessage} message={message} submitMessage={submitMessage} /> */}
        </ChatContainer>
    );
}
export default Chat;