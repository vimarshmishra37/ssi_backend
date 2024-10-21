const mongoose=require("mongoose");
const user = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    age: Number,
    gender: String,
    dob: Date,
    address: String,
    phone: Number,
    role: String

});

module.exports=mongoose.model("users",user)