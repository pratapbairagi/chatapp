import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.css"
import { io } from "socket.io-client"
import React from "react"
import Main from "./components/chat/main";
import "./App.css"

// const socket = io("http://localhost:4999")
const ENDPOINT = "https://wechat-free.herokuapp.com"
const socket= io(ENDPOINT, {transports:['websocket','polling'], forceNew:true})
// const socket= io("ws://localhost:4999")
// var socket = io.connect("http:// 127.0.0.1:4999", {
//    forceNew: true,
//    transports: ['websocket'],
// });



function App() {

  return (
    <>
    <Main socket={socket}/>
    </>
  );
}

export default App;
