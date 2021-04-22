const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/user');
const createError = require('http-errors');
const {authSchema} = require('../helpers/routeHelpers');
const {JWT_SECRET} = require('../../configs/keys');
const { signAccessToken,
        signRefreshToken,
        verifyRefreshToken } = require('../helpers/jwtHelpers');
const client = require('../../configs/initRedis');

module.exports = {
  signUp:async (req,res,next) => {
    try{
      const {email,password} = req.body;    
      //Server Validation
      const result = await authSchema.validateAsync({email,password});
      // Check If User Already Exists
      const userExists = await User.findOne({"local.email":result.email});
      if(userExists){
        throw createError.Conflict(`${result.email} is already registered`);
      }
      //Create New User
      const newUser = new User({
        _id:new mongoose.Types.ObjectId(),
	method:'local',
	local:{
	  email:result.email,
	  password:result.password
	}
      })
      const savedUser = await newUser.save();
      const accessToken = await signAccessToken(savedUser.id);
      const refreshToken = await signRefreshToken(savedUser.id)
      res.status(201).json({
	accessToken,refreshToken,
        user:savedUser,
	message:savedUser+" is successfully saved"
      })
    }catch(err){
      if(err.isJoi === true){
        err.status = 422
      }
      next(err)
    }
  },
  signIn:async () => {
  
  },
  dashBoard:async (req,res,next) => {
    res.status(200).json({
      header:req.header['authorization'],
      user:req.user,
      message:'This is a protected users dashboard'
    })
  },
  GoogleOAuth:async (req,res,next) => {
    const accessToken = await signAccessToken(req.user.id);
    res.status(200).json({
      accessToken,
      user:req.user,
      message:'Google Token Page'
    })
  }
}
