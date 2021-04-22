const passport = require('passport');
const mongoose = require('mongoose');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const User = require('../../models/user');
const {GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET} = require('../../configs/keys').GOOGLE_CLIENT_OAUTH;

//Google OAuth Strategy
passport.use('googleToken',new GooglePlusTokenStrategy({
    clientID:'GOOGLE_CLIENT_ID',
    clientSecret:'GOOGLE_CLIENT_SECRET'
  },async (accessToken,refreshToken,profile,done) => {
      try{
        console.log('accessToken: ',accessToken);
	console.log('refreshToken: ',refreshToken);
	console.log('profile: ',profile);
	//Check If User Exists
	const userExists = await User.findOne({"google.id":profile.id});
	if(userExists){
	  console.log('User Already Exists');
          return done(null,userExists)
	}
        //If New Account
	const newUser = new User({
	  _id:new mongoose.Types.ObjectId(),
          method:'google',
          google:{
	    id:profile.id,
            email:profile.emails[0].value
	  }
	})
        //Save The New User
	const newUserSaved = await newUser.save();
	console.log("New User Created Successfully")
	done(null,newUser)
      }catch(err){
	throw new Error(err);
        done(err,false,err.message)
      }
  })
)

module.exports = passport;
