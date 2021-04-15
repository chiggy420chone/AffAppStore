const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id:mongoose.Schema.Types.ObjectId,
  brand:{
    type:String,
    required:true
  },
  item:{
    type:String,
    required:true
  },
  price:{
    type:Number,
    required:true
  },
  date:{
    type:Date,
    default:Date.now
  }
})

const Product = mongoose.model('products',productSchema);

module.exports = Product;
