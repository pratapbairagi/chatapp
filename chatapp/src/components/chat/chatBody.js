
const ChatBody = ({users,user, messages, selectedUser, typing}) => {
    return (
        <div className="chatBody">
        {/* <div className="allUsersContainer" >
            <span>Connected Users</span>
            <div className="users">
                {users.map((u,i)=>{
                    return (
                        <div className="usersConnectedContainer" key={i}>
                        <span>{u.username}</span>
                        </div>
                    )
                })}
            </div>
        </div> */}
        <div className="chatsContainer">
            {messages.map((m,i)=>{
               return  m.type === "userStatus" ?
                <div key={i} style={{margin:".3rem auto", width:"100%"}}>
                    <span style={{background:"skyblue", color:"white", fontWeight:"600", padding:".1rem .4rem", borderRadius:"4px"}}>{m.userId === user.userId ? "You have joined" : `${m.username} : has joined the chat !`}</span>
                </div>
                :
                <div className="chatMessagesRow" key={i} style={{width:"100%", marginTop:".3rem", display:"flex", flexDirection:"column", alignItems:`${m.userId === user.userId ? "flex-end" :"flex-start"}`, rowGap:".2rem"}}>
                    <img style={{width:"3rem", height:"3rem", borderRadius:"50%"}} src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="" />
                    {/* <div style={{borderRadius:"6px", borderTopRightRadius:`${m.userId === user.userId ? "0" : "6px"}`,borderTopLeftRadius:`${m.userId !== user.userId ? "0" : "6px"}`, background:"teal", width:"max-content", minWidth:"10rem", maxWidth:"85%", float:`${m.userId === user.userId ? "right" :"left"}`}}> */}
                    <div style={{borderRadius:"6px", borderTopRightRadius:`${m.userId === user.userId ? "0" : "6px"}`,borderTopLeftRadius:`${m.userId !== user.userId ? "0" : "6px"}`, background:`${m.userId === user.userId ? "teal": "rgb(15, 179, 179)"}`, width:"max-content", minWidth:"10rem", maxWidth:"85%"}}>

                        <div className="mssgSender" style={{fontSize:"70%", colort:"white", width:"100%",padding:".3rem .5rem", fontWeight:"500", textAlign:`${m.userId === user.userId ? "right" :"left"}`, color:"white"}}>{m.userId === user.userId ? "You" : selectedUser.username}</div>
                        <div className="mssgText" style={{width:"95%", margin:"0 auto",background:"white", color:"black", padding:".5rem .3rem", borderRadius:"4px", textAlign:"left", fontSize:"70%"}}>{m.message}</div>
                        <div className="mssgTime" style={{fontSize:"50%", color:"white", colort:"white", width:"100%",padding:".2rem .4rem", textAlign:"right"}}>{new Date(m.time).toLocaleString()}</div>

                    </div>
                </div>
            
            })}
        </div>
    </div>
    );
}
export default ChatBody;