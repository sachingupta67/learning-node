
const express = require("express");
const { adminAuthMiddleware } = require("./middlewares/auth");
const app = express();
app.use('/admin', adminAuthMiddleware)
app.get('/admin/getData',(req,res)=>{
    console.log(x)
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

app.use("/",(err,_req,res,_next)=>{
    if(err){
        console.log("check:::",err);
        res.status(500).send("Internal Server Error");
    }
})
app.listen(8080,()=>{
    console.log("Server Running at Port : 8080......");
})
