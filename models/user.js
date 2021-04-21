const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//create schema
const userSchema = new mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  method:{
    type:String,
    enum:['local','google','facebook'],
    required:true
  },
  local:{
    email:{
      type:String,
      lowercase:true,
      unique:true
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

//Create A Middleware:BcryptJS
userSchema.pre('save',async function(next){
  try{
    if(this.method !== 'local'){
      next();
    }
  //Generate A Salt
  const salt = await bcrypt.genSalt(10);
  //
  const hashedPassword = await bcrypt.hash(this.local.password,salt);
  this.local.password = hashedPassword;
  console.log('salt: ',salt);
  console.log('normal password: ',this.local.password);
  console.log('hashed password; ',hashedPassword)
  }catch(err){
  next(err)
  }
})

//Middleware:Compare Password
userSchema.methods.isValidPassword = async function(password){
  try{
    const passwordMatched = await bcrypt.compare(password,this.password)
    return passwordMatched
  }catch(err){
    throw new Error(err)
  }
}
//create a model
const User =  mongoose.model('users',userSchema);

//export the model
module.exports = User;
