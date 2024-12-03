const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // Anyone can come and use website as admin
  // const newUser = await User.create(req.body) ;

  // No longer as admin
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  const token = signToken(newUser.id);
  res.status(201).json({
    status: 'success',
    data: {
      token: token,
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist :
  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  // 2. check if user exists && password is correct.
  //explicitely we have selected password
  const user = await User.findOne({ email }).select('+password');
  // const correct = await user.correctPassword(password , user.password)

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // console.log(user);

  // 3. If everything Ok , send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1. Getting token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get success.', 401),
    );
  }
  // 2. Verification Token:
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  // 3. Check if user still exists: No one has changed current token
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token is no longer exist.', 401),
    );

  // 4. Check if user changed password after the token is
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed password! Please login in again.',
        401,
      ),
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});



exports.restrictTo = (...roles)=>{
  return (req , res , next)=>{
    // roles ['admin' , 'lead-guide'] 
    if(!roles.includes(req.user.role)){
      return next(new AppError("You do not have permission to perform this action" , 403))
    }
    next();
  }
}