
const Login = ({nameInputHandler, submitNewUser}) => {
  
    return (
        <div className="row" style={{height:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
        <div className="col-12">
          <h5>Enter User Name</h5>
        </div>
        <div className="d-flex justify-content-center py-1">
          <div className="col col-md-6 col-xl-4 col-10">
            <input
              type="text"
              name="usrename"
              defaultValue=""
              className="form-control text-center mb-3"
              placeholder="Enter Name"
              id=""
              onChange={nameInputHandler}
              onKeyPress={(e) => {return e.code === "Enter" ? submitNewUser() : null}}
              style={{textTransform:"uppercase"}}
            />
            <div className="btn btn-success w-100 fw-bold" onClick={()=>submitNewUser()}>JOIN</div>
          </div>

        </div>
      </div>
    );
}
export default Login;