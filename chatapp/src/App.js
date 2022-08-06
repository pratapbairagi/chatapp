import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.css"
import { io } from "socket.io-client"
import React from "react"
import Main from "./components/chat/main";
import "./App.css"

// const socket = io("http://localhost:4999")
// const ENDPOINT = "http://localhost:4999"
// const socket= io(ENDPOINT, {transports:['websocket']})
// const socket= io("ws://localhost:4999")
var socket = io.connect("http://localhost:4999", {
   forceNew: true,
   transports: ["polling"],
});



function App() {

  return (
    <>
    <Main socket={socket}/>
    </>
  );
}

export default App;
