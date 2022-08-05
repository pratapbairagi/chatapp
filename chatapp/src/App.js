import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.css"
import { io } from "socket.io-client"
import React from "react"
import Main from "./components/chat/main";
import "./App.css"

const socket = io("http://localhost:4999")

function App() {

  return (
    <>
    <Main socket={socket}/>
    </>
  );
}

export default App;
