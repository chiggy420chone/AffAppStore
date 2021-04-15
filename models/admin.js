const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

//Create Schema
const adminSchema = new Schema({
  _id:mongoose.Schema.Types.ObjectId,
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true
  },
  password:{
    type:String,
    required:true
  },
  dateCreated:{
    type:String,
    default:Date.now
  }
})

//Create A Middlewares:BCRYPTJS
adminSchema.pre('save',async function(next){
  try{
  //Generate A Salt
  const salt = await bcrypt.genSalt(10);
  //Hash Password
  const hashedPassword = await bcrypt.hash(this.password,salt);
  this.password = hashedPassword;
  next()
  }catch(err){
    next(err)
  }
})

//Middleware: Compare Password
adminSchema.methods.isValidPassword = async function(password){
  try{
    const passwordMatched = await bcrypt.compare(password,this.password)
    return passwordMatched
  }catch(err){
    throw new Error(err)
  }
}
//Create A Model
const Admin = mongoose.model('admins',adminSchema);

module.exports = Admin;
