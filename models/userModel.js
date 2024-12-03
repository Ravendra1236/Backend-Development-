const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, // To remove extra spaces
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'A user must have a email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  role : {
    type : String,
    enum : ['user' , 'admin' , 'guide' ,'lead-guide']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and  SAVE !
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same.',
    },
  },
  passwordChangedAt : Date
});

userSchema.pre('save' ,async function(next){

    // ONLY RUN THIS FUNCTION IF PASSWORD WAS ACTUALLY MODIFIED
    if(!this.isModified('password')) return next() ;

    // HASH THE PASSWORD WITH THE COST OF 12
    this.password = await bcrypt.hash(this.password , 12)
    // WE DO NOT WANT TO STORE CONFIRM PASSWORD IN OUR DB
    this.passwordConfirm = undefined
    next();
})

userSchema.methods.correctPassword = async function(candidatePassword , userPassword){
  return await bcrypt.compare(candidatePassword , userPassword)
}
userSchema.methods.correctPassword = async function(candidatePassword , userPassword){
  return await bcrypt.compare(candidatePassword , userPassword)
}

userSchema.methods.changedPasswordAfter = async function(JWTTimestamp){
  if(this.passwordChangedAt){
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000 , 10);
    // console.log(this.passwordChangedAt , JWTTimestamp);
    return JWTTimestamp < changedTimestamp ;
  }

  // FALSE means not changed
  return false ;
}
const User = mongoose.model('User', userSchema);
module.exports = User;
