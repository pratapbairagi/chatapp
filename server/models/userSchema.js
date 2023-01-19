import mongoose from "mongoose"

const userModel = new mongoose.Schema({
    name:{
        type: String,
        minlength:[3,"Name should have atleat 3 charactors !"],
        maxlength:[10, "Name can not exceed 10 charactors !"],
        required: [true,"Please fill name field !"]
    },
    email:{
        type: String,
        // minlength:[3,"Name should have atleat 3 charactors !"],
        // maxlength:[10, "Name can not exceed 10 charactors !"],
        // unique:[true,"Email already exist !"],
        required: [true,"Please fill email field !"]
    },
    phone:{
        type: Number,
        minlength:[10," Number must have 10 digits !"],
        maxlength:[10, "Number must have 10 digits !"],
        required: [true,"Please fill number field !"]
    },
    gender:{
        type: String,
        required: [true,"Please select gender field !"]
    },
    age:{
        type: Number,
        minlength:[1," Age should have atleat one digit !"],
        maxlength:[2, " Age can not exceed 2 digits !"],
        required: [true,"Please fill age field !"]
    },
    password:{
        type: String,
        minlength:[8,"Password should have atleat 8 charactors !"],
        required: [true,"Please fill password field !"]
    }
})

export const User = new mongoose.model("user", userModel)