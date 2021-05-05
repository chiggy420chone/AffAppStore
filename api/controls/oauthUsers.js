/*--
 *
const passport = require('passport');
const passportConf = require('../middlewares/passportConf');
--*/

module.exports = {
  OAuthGoogleCallback:async (req,res,next) => {
    try{
      console.log('req.user: ',req.user);
      res.redirect('/oauths/google/user');
    }catch(err){
      next(err)
    }
  },
  OAuthGoogleUser:async (req,res,next) => {
    try{
      console.log('Google OAuth User: ',req.user.google.email)
      res.status(200).json({
        message:'Welcome Back Google OAuth User',
	email:req.user.google.email
      })
    }catch(err){
      next(err)
    }
  }
}
