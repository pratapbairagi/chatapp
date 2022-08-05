import { useCallback, useEffect, useState } from "react"
import Chat from "./chat"
import Login from "./login"


const Main = ({ socket }) => {

  const [newUser, setNewUser] = useState("")
  const [user, setUser] = useState("")
  const [users, setUsers] = useState("")
  const [messages, setMessages] = useState([])

  function nameInputHandler(e) {
    setNewUser(e.target.value)
  }

  const localSessionId = localStorage.getItem("sessionId") // 2.8
  
  const checkIfUserExistWithSession = useCallback(() => {
  //   // this callback will help to re-login user
  //   // if localstorage has session id
    const sessionId = localSessionId
  //   console.log(sessionId)
    if (sessionId) {
      socket.auth = { sessionId }
      socket.connect();
    }
  }, [socket, localSessionId])

  
  useEffect(() => {

    socket.on("users", users => { // step 2.6
      // const messageArr = []
      // users.forEach((u) => {
      //   const newMessage = { type: "userStatus", username: u.username, userId: u.userId }
      //   messageArr.push(newMessage)
      // })
      // setMessages(messageArr)
      setUsers(users)
    })

    socket.on("session", ({ sessionId, userId, username }) => { // step 2.7
      if (username && userId && sessionId) {
        socket.auth = { sessionId }
        localStorage.setItem("sessionId", sessionId) // set sessionId while stablishing the socket connection
        setUser({ username, userId })
      }
    })

    checkIfUserExistWithSession() // step 2.8


  //   // rec new messages
  //   socket.on("new message", ({ userId, username, message }) => {
  //     setMessages([...messages, {
  //       type: "message",
  //       userId,
  //       username,
  //       message
  //     }])
  //   })
  }, [socket, messages, setMessages, user, setUser, setUsers, users, checkIfUserExistWithSession])

  function submitNewUser() { /// step 1

    if (newUser) {

      socket.auth = { username: newUser }
      socket.connect()
    }
    else if (!newUser) {

    }
  }

  return (
    <main className="content" style={{ gap: "0", display: "flex", flexDirection: "column" }}>
      <div className="container">
        <div className="card w-100 text-center border-white" style={{ gap: "0", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
          {!user.username &&
            <Login nameInputHandler={nameInputHandler} submitNewUser={submitNewUser} />
          }

          {user.username &&
            <Chat user={user} setUser={setUser} messages={messages} setMessages={setMessages} users={users} setUsers={setUsers} socket={socket}/>
          }
        </div>
      </div>
    </main>
  );
}
export default Main;