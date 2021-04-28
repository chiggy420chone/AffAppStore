const express = require('express');
const isAuthenticated = (req,res,next) => {
  if(req.isAuthenticated()){
    return next() 
  }else{
    res.redirect('/')
  }	  
}

module.exports = isAuthenticated;
