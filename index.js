const express=require("express"); 
const mongoose=require("mongoose");
const port = 3000;
const app=express();
mongoose.connect("mongodb+srv://vim:XXBqgiMHu3B59kNx@ssi.1z8xe.mongodb.net/?retryWrites=true&w=majority&appName=SSI",
    {
   
    }).then((x)=>{console.log("connected to mongodb")}).catch((e)=>{console.log(e)});
app.get("/",(req,res)=>{
    res.send("hello");
})
app.listen(port,()=>{console.log("server started")});
app.get("/form",(req,res)=>{
    res.send("form")
})