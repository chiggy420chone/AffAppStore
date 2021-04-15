const mongoose = require('mongoose');
const bcrypt = require('bcrypts')

//create schema
const userSchema = new mongoose.Schema({
  _id:mongoose.Schema.types.ObjectId,
  method:{
    type:String,
    enum:['local','google','facebook'],
    required:true
  },
  local:{
    email:{
      type:String,
      lowercase:true
    },
    password:{
      type:String
    },
    dateCreated:{
      type:Date,
      default:Date.now
    }
  }
})

//create a model
const User =  mongoose.model('users',userSchema);

//export the model
module.exports = User;
