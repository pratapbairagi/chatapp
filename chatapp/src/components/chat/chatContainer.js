
const ChatContainer = (props) => {
    return (
        <div className="row p-0" style={{ display: "felx", flexWrap: "wrap", justifySelf:"flex-start", alignItems:"flex-start", gap:"0", position:"relative", height:"100vh"}}>
        
        {props.children}
        {/* <div className="col-4 p-0" style={{ border: "1px solid teal", minHeight:"70vh", overflow:"auto" }}>
          <span className="text-light bg-dark w-100 d-block sticky-top">Users Connected</span>
        </div> */}
        

      </div>
    );
}
export default ChatContainer;