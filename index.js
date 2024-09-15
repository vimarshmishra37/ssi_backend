const express=require("express"); 
const port = 3000;
const app=express();
app.get("/",(req,res)=>{
    res.send("hello");
})
app.listen(port,()=>{console.log("server started")});
app.get("/form",(req,res)=>{
    res.send("form")
})