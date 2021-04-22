const router = require('express').Router();
const UsersControl = require('../controls/users');
const {verifyAccessToken,verifyRefreshToken} = require('../helpers/jwtHelpers');
const passport = require('passport');
const passportConf = require('../middlewares/passportConf');

router.route('/signup')
  .post(UsersControl.signUp)

router.route('/signin')
  .post(UsersControl.signIn)

router.route('/oauth/google')
  .post(passport.authenticate('googleToken',{session:false}),UsersControl.GoogleOAuth)


/*--
router.route('/auth/facebook')
  .post(UsersControl.facebookOAuth)
--*/
router.route('/dashboard')
  .get(verifyAccessToken,UsersControl.dashBoard)

module.exports = router;
