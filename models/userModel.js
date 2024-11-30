const validator = require("validator");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, // To remove extra spaces
    required: [true, 'A user must have a name'],
    unique: true,
  },
  email : {
    type : String , 
    trim : true ,
    required : [true , "A user must have a email"],
    unique : true ,
    lowercase : true,
    validate : [validator.isEmail , "Please provide a valid email"],

  },
  photo : {
    type : String
  },
  password : {
    type : String ,
    required : [true , "Please provide a password"] ,
    minlength : 8,
    select : false
  },
  passwordConfirm : {
    type : String ,
    required : [true , "Please confirm your password"],
    // validate : {
    //     // This only works on CREATE and  SAVE !
    //     validator : function(el){
    //         return el === this.password
    //     },
    //     message : "Passwords are not the same."
    // }
  }
});

// userSchema.pre('save' ,async function(next){

//     // oNLY RUN THIS FUNCTION IF PASSWORD WAS ACTUALLY MODIFIED
//     if(!this.isModified('password')) return next() ;

//     // HASH THE PASSWORD WITH THE COST OF 12
//     this.password = await bcrypt.hash(this.password , 12)
//     this.passwordConfirm = undefined 
//     next();
// })

const User = mongoose.model("User",userSchema  );
module.exports = User ;
