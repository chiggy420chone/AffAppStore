const router = require('express').Router();
const UsersControl = require('../controls/users');
const {verifyAccessToken,verifyRefreshToken} = require('../helpers/jwtHelpers');
const passport = require('passport');
const passportConf = require('../middlewares/passportConf');
//const isAuthenticated = require('../middlewares/isAuthOAuth');

router.route('/signup')
  .post(UsersControl.signUp)

router.route('/signin')
  .post(UsersControl.signIn)

router.route('/token/google')
  .post(passport.authenticate('googleToken',{session:false}),UsersControl.GoogleOAuthToken)

router.route('/dashboard')
  .get(verifyAccessToken,UsersControl.dashBoard)

module.exports = router;

function isAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/')
  }
}

