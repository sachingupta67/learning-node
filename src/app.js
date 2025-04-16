
const express = require("express");
const { adminAuthMiddleware } = require("./middlewares/auth");
const app = express();
app.use('/admin', adminAuthMiddleware)
app.get('/admin/getData',(req,res)=>{
    res.send("admin data all")
})

app.get('/admin/delete',(req,res)=>{
    res.send("user data deleted")
})

app.use("/users",(req,res,next)=>{
    console.log("first middleware");
    next()
    res.send("first middleware")
},(req,res)=>{
    console.log("second middleware");
    res.send("second middleware") 
})
app.listen(8080,()=>{
    console.log("Server Running at Port : 8080......");
})
