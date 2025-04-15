
const express = require("express");
const app = express();

app.get("/user",(req,res)=>{
    res.send({
        name:"Amit",
        age:22
    });
})

app.post("/user",(req,res)=>{
   console.log("Save data")
   res.send("Data successfully saved")
})
app.listen(8080,()=>{
    console.log("Server Running at Port : 8080......");
})
