const User = require('./../models/userModel');
//const catchAsync = require('./../utils/catchAsync'); // Ensure you have this utility
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create(req.body); // Add input validation as necessary
    const token =  jwt.sign({id : newUser._id } , process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRES_IN
    })

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.login = async (req, res) =>{
    const {email , password} = req.body ;

    // 1. If email and password exist 
    if(!email || !password ){
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide both email and password!',
        });
    }
    // 2. Check if user exists and password is correct 

    const user = User.findOne({email })
    // 3. if everything ok , send token to client
    const token = ''
    res.status(200).json({
        status : 'success',
        token
    })
}
