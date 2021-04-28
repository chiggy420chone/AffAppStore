const mongoose = require('mongoose');

//Create An OAuth User Schema
const OAuthUserSchema = new mongoose.Schema({
  GoogleOAuth:{
    googleId:{
      type:String,
      required:true,
      unique:true
    },
    googleName:{
      type:String,
      required:true
    },
    googleEmail:{
      type:String,
      required:true,
      lowercase:true,
      index:{unique:true,sparse:true}
    },
    googlePhoto:{
      type:String
    },
    dateCreated:{
      type:Date,
      default:Date.now
    }    
  }
})

const OAuthUser = mongoose/model('users',OAuthUserSchema);

module.exports = OAuthUser;
