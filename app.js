const fs = require("fs")
const express = require("express");
const morgan = require('morgan');
const tourRouter = require("./routes/toursRoutes.js")
const userRouter = require('./routes/usersRoutes.js');


const app = express()

// 1. Middleware 
// Middleware : Will take JSON as data
app.use(morgan('dev'));
app.use(express.json())
// app.use(express.static(`${__dirname}/public`)) ;

app.use((req , res , next)=>{
    console.log("Middleware called in terminal");
    next();
})

app.use((req , res, next)=>{
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime);
    next();
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app ;
