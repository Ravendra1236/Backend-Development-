const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");


exports.getAllUsers = catchAsync(async(req , res)=>{
  const users = await User.find();

  // send response : 
  res.status(200).json({
    status : "success",
    results : users.length,
    data : {
      users
    } 
  })
})

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route has not been creater yet !',
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route has not been creater yet !',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route has not been creater yet !',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route has not been creater yet !',
  });
};
