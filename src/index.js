const express = require('express');
const mongoose = require('mongoose');
const multer=require('multer')
const bodyparser = require("body-parser")
const route = require('./routers/router')
const app = express();

app.use(express.json())
app.use(multer().any())
app.use(bodyparser.urlencoded({extended : true }));

mongoose.connect("mongodb+srv://varinda:Flipkart@newproject.7qwzr8u.mongodb.net/group41Database",
{
    useNewUrlParser:true
})
.then(()=>{
    console.log("MongoDb is connected")
})
.catch( err => console.log(err) )

app.use('/',route)

app.listen(3001, ()=>{
    console.log("Server running on Port "+ 3001)
})
