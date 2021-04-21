const express = require('express');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');

const app = express();

//Set Routes
const adminRoutes = require('./api/routes/admin');
const userRoutes = require('./api/routes/users');
const productRoutes = require('./api/routes/products');

//Mongoose Connection
const MongooseConnection = require('./configs/init_mongoDb');
//Redis Connection
const RedisConnection = require('./configs/initRedis');

//Middlewares
app.use(logger('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Static 
app.use(express.static(path.join(__dirname,'./public/')));

//CORS
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
      return res.sendStatus(200)
    }
    next()
  }
);

//Routes Testing
app.all('/test',(req,res,next)=>{
  console.log(req.query)
  res.send(req.query)
})

//Routes
app.use('/admin',adminRoutes);
app.use('/users',userRoutes);
app.use('/products',productRoutes);

//Error Handling
app.use(async (req,res,next) => {
  next(createError.NotFound('Page Is Not Found'));
  }
);

app.use((err,req,res,next) => {
    res.status(err.status || 500)
    res.send({
      error:{
        errStatus:err.status || 500,
	errMessage:err.message
      }
    })
  }
);

module.exports = app;
