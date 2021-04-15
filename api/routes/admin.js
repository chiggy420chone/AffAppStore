const router = require('express').Router();
const adminControls = require('../controls/admin');
const {verifyAccessToken,verifyRefreshToken} = require('../helpers/jwtHelpers')

router.route('/signup')
  .post(adminControls.signUp)

router.route('/signin')
  .post(adminControls.signIn)

router.route('/dashboard')
  .get(verifyAccessToken,adminControls.dashBoard)
  
router.route('/refresh-token')
  .post(adminControls.refreshToken)

router.route('/logout')
  .delete(adminControls.adminLogout)

module.exports = router
