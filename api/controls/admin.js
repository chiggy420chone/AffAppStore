const JWT = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../../models/admin');
const createError = require('http-errors');
const {authSchema} = require('../helpers/routeHelpers');
const {signAccessToken,
       signRefreshToken,
       verifyRefreshToken} = require('../helpers/jwtHelpers');
const client = require('../../configs/initRedis');

module.exports = {
  signUp:async(req,res,next) => {
    try{
      const {email,password} = req.body;
      //Server Validation
      const result = await authSchema.validateAsync({email,password})
      //Check If Amin Already Exists
      const adminExists = await Admin.findOne({email:result.email});
        if(adminExists){
	  throw createError.Conflict(`${result.email} is already registered`);
	}
      //Create New Admin
      const newAdmin = new Admin({
        _id:new mongoose.Types.ObjectId(),
	email:result.email,
	password:result.password
      })
      const savedAdmin = await newAdmin.save();
      //Generate token
      const accessToken = await signAccessToken(savedAdmin.id);
      const refreshToken = await signRefreshToken(savedAdmin.id);
      //respond with token
      res.status(201).json({
        accessToken,refreshToken,
	message:savedAdmin+' is successfully created.'
      })
    }catch(err){
      if(err.isJoi === true){
        err.status = 422
      } 
      next(err)
    }
  },
  signIn:async (req,res,next) => {
    try{
      const result = await authSchema.validateAsync(req.body); 
      const admin = await Admin.findOne({email:result.email})
      if(!admin){
        throw createError.NotFound('User is not registered');
      }
      const isMatch = await admin.isValidPassword(result.password)
      if(!isMatch){
        throw createError.Unauthorized('Email/Password is not valid')
      }else{
        console.log(isMatch)
      }
      const accessToken = await signAccessToken(admin.id)
      const refreshToken = await signRefreshToken(admin.id)
      res.status(200).json({
        accessToken,refreshToken,
	message:'Admin is logged in successfully'
      })
    }catch(err){
      if(err.isJoi === true){
        return next(createError.BadRequest("Invalid Username/Password"))
      }
      next(err)
    }
  },
  dashBoard:async (req,res,next) => {
    console.log(req.headers['authorization'])
    res.status(200).json({
      header:req.header['authorization'],
      message:"Admin Protected DashBoard"
    })
  },
  refreshToken:async (req,res,next) => {
    try{
      const {refreshToken} = req.body
      if(!refreshToken){
        throw createError.BadRequest()
      }
      const adminId = await verifyRefreshToken(refreshToken)
      const accessToken = await signAccessToken(adminId)
      const newRefreshToken = await signRefreshToken(adminId)
      res.status(200).json({
	accessToken:accessToken,
	refreshToken:newRefreshToken,
	message:'Generating A New Refresh Token'
      })
    }catch(err){
      next(err)
    }
  },
  adminLogout:async (req,res,next) => {
    try{
      const {refreshToken} = req.body
      if(!refreshToken){
        throw createError.BadRequest()
      }
      const admin = await verifyRefreshToken(refreshToken)
      client.DEL(admin,(err,value) => {
        if(err){
	  throw createError.InternalServerError()
	}
	console.log(value)
	res.status(204).json({
	  value:value,
          message:'Logged Out Successfully'
	})
      })
    }catch(err){
      next(err)
    }
  }
}



