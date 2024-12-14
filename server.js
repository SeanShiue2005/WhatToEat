const express = require("express");
const app = express();
const portNum =5527;

app.get("/" , (req,res)=>{
    res.send("嗨嗨，我是nodejs server");
});

app.listen(portNum,()=>{
    console.log("server is running at the ${portNum}")
});