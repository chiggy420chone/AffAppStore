const router = require('express').Router();
const OAuthUser = require('../controls/oauthUsers');
const passport = require('passport');
const passportConf = require('../middlewares/passportConf');
const isAuthenticated = require('../middlewares/isAuthOAuth');
/*--
function isAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/')
  }
}
--*/
router.route('/google')
  .get(passport.authenticate('google',{
    scope:['profile','email']  
  })
)

router.route('/google/callback')
  .get(passport.authenticate('google',{failureRedirect:'/'}),OAuthUser.OAuthGoogleCallback)

router.route('/google/user')
  .get(isAuthenticated,OAuthUser.OAuthGoogleUser)


module.exports = router;
