const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const {AccessTokenSecret,RefreshTokenSecret} = require('../../configs/keys')
const client = require('../../configs/initRedis');

module.exports = {
  signAccessToken:(admin) => {
    const promise =  new Promise((resolve,reject) => {
      const payload = {
        iss:'AffStore Company',
	sub:admin._id,
	aud:admin,
	iat:new Date().getTime()
      }
      const secret = AccessTokenSecret;
      const options = {
        //iat:new Date().getTime(),
	expiresIn:'3m'
      }
      JWT.sign(payload,secret,options,(err,token) => {
        if(err){
	  reject(createError.InternalServerError());
	  return true
	}
	resolve(token)
      })
    })
    return promise
  },
  verifyAccessToken:(req,res,next) => {
    if(req.headers['authorization']){
      const authHeader = req.headers['authorization'];
      const bearerToken = authHeader.split(' ');
      const token = bearerToken[1];
      JWT.verify(token,AccessTokenSecret,(err,payload) => {
        if(err){
	  if(err.name === 'JsonWebTokenError'){
	    return next(createError.Unauthorized())
	  }else{
	    return next(createError.Unauthorized(err.message))
	  }
	}
	req.payload = payload
	next()
      });
    }else{
      return next(createError.Unauthorized())
    }
  },
  signRefreshToken:(admin) => {
    return new Promise((resolve,reject) => {
      const payload = {
	      iss:'AffStore Company',
              sub:admin._id
            }
      const secret = RefreshTokenSecret
      const options = {
        expiresIn:'1h',
	audience:admin
      }
      JWT.sign(payload,secret,options,(err,token) => {
        if(err){
	  console.log(err.message)
          reject(createError.InternalServerError())
	}
	client.SET(admin,token,'EX',1*1*60*60,(err,reply) => {
	  if(err){
	    console.log(err.message)
	    reject(createError.InternalServerError())
            return
	  }
	resolve(token)
	})
      });
    });
  },
  verifyRefreshToken:(refreshToken) => {
    const promise = new Promise((resolve,reject) => {
      JWT.verify(refreshToken,RefreshTokenSecret,(err,payload) => {
        if(err){
	  return reject(createError.Unauthorized())
	}
	const admin = payload.aud;
	client.GET(admin,(err,result) => {
	  if(err){
	    console.log(err.message)
	    reject(createError.InternalServerError())
	    return
	  }
	  if(refreshToken === result){
	    return resolve(admin)
	  }else{
	    reject(createError.Unauthorized())
	  }
	})
      })
    })
    return promise
  }
}//
