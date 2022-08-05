
const ChatHeader = ({ user, typing }) => {

  return (
    //   <div className="col-12 p-0" style={{ border: "1px solid teal", display: "flex", justifyContent: "flex-start", alignItems:"center", position:"relative", height:"12vh" }}>
    //   <img src="https://bootdey.com/img/Content/avatar/avatar3.png" style={{ width: "3rem", height: "3rem", borderRadius: "50%", margin: ".3rem .6rem", border:"1px solid red" }} alt="avatar" />
    //   <span className="text-success" style={{ textAlign: "left", width: "max-content",  display:"block", fontWeight:"600" }}>{user}</span>
    // </div>
    <div className="col-12 p-0 header_mssgingUserContainer">
      <img src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="avatar" />
      <span className="text-success">{user.username}</span>
      <span className="text-success" style={{marginLeft:".4rem", color:"white", fontSize:"80%"}}>{typing? "is typing..." : null}</span>

    </div>
  );
}
export default ChatHeader;