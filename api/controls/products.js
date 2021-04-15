const Product = require('../../models/product');
const mongoose = require('mongoose');
const createError = require('http-errors');

module.exports = {
  GetProducts: async (req,res,next) => {
    try{
      const results = await Product.find();
      res.status(200).json({results})
    }catch(error){
      next(error)
    }
  },
  PostProduct: async (req,res,next) => {
    try{
      let {brand,item,price} = req.body;
      const product = new Product({
        _id:new mongoose.Types.ObjectId(),
	brand:brand,
	item:item,
	price:price
      })
      const result = await product.save()
      res.status(201).json({result})
    }catch(error){
      console.log(error.message)
      if(error.name === 'ValidationError'){
        next(createError(422,error.message))
	return
      }
      next(error)
    }
  },
  filterProduct: async (req,res,next) => {
    try{
      const id = req.params.id;
      const product = await Product.findById(id)
      if(!product){
        throw createError(404,'Product does not exists.')
      }
      res.status(200).json({product})
    }catch(error){
      console.log(error.message)
      if(error instanceof mongoose.CastError){
        next(createError(400,'Invalid Product Id'))
	return
      }
      next(error)
    } 
  },
  patchProduct: async (req,res,next) => {
    try{
      const id = req.params.id;
      const updates = req.body
      const result = await Product.findByIdAndUpdate(id,updates,{new:true});
      if(!result){
        throw createError(404,'Product does not exists')
      }
      res.status(200).json({result})
    }catch(error){
      console.log(error.message)
      if(error instanceof mongoose.CastError){
        return next(cerateError(400,'Invalid Product Id'))
      }
      next(error);
    }
  },
  delProduct:async (req,res,next) => {
    try{
      const {id} = req.params;
      const result = await Product.findByIdAndDelete(id)
      if(!result){
        throw createError(404,'Product does not exists.')
      }
      res.status(200).json({
        message:"successfully deleted an item",
	item:req.body.item
      })
    }catch(error){
      console.log(error.message)
      if(error instanceof mongoose.CastError){
        next(createError(400,'Invalid Product Id'))
        return
      }
      next(error)
    }
  }
}
