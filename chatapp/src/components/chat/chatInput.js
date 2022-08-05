
const ChatInput = ({setMessage, message, submitMessage}) => {

    function messageHandle (e){
        setMessage(e.target.value)
      }
  
      
    return (
        <div className="col-12 p-0" style={{ border: "1px solid teal", height:"11vh", position:"relative" }}>
        <div className="input-group p-2" style={{ bottom:"0", display:"flex", alignItems:"center", height:"100%"}}>
          <input value={message} onChange={messageHandle} onKeyPress={(e)=> e.code === "Enter" ? submitMessage() : null} type="text" className="form-control" placeholder="Type your Message" name="" id="" />
          <button onClick={()=>submitMessage()} className="btn btn-success px-3">SEND</button>
        </div>
      </div>
    );
}
export default ChatInput;