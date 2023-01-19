import mongoose from "mongoose"
export const mongoConn = async (url) => {
    
    try {

        mongoose.connect(url).then((res)=>{
            console.log("mongo connected")
        }).catch((err)=>{
            console.log("errorrrrrr", err)
        })
    } catch (error) {
        
    }
    
}