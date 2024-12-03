const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/toursRoutes.js');
const userRouter = require('./routes/usersRoutes.js');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');

const app = express();

// 1. Middleware
// Middleware : Will take JSON as data
app.use(morgan('dev'));
app.use(express.json());
// app.use(express.static(`${__dirname}/public`)) ;

app.use((req, res, next) => {
  console.log('Middleware called in terminal');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.requestTime);
  // console.log(req.headers);
  // console.log(req.headers.authorization.split(' ')[1]);
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handle Unhandled routes
app.all('*', (req, res, next) => {
  // Creating Error :
  next(
    new AppError(`Cannot find this  ${req.originalUrl} on the server.`, 404),
  );
});

// Global Error Handling :
app.use(globalErrorHandler);

module.exports = app;
