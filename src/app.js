
const express = require("express");
const app = express();
// app.use((req,res)=>{
//     res.send("Hello World")
// })
// app.use('/',(req,res)=>{
//     res.send("Hello World from root")
// })
app.use('/hello',(req,res)=>{
    res.send("Hello World from hello")
})

app.use('/test',(req,res)=>{
    res.send("Hello World from test")
})

app.listen(8080,()=>{
    console.log("Server Running at Port : 8080......");
})
