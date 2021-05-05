const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const createError = require('http-errors');
const sessionSecret = require('./configs/keys').SESSION_SECRET;
const app = express();

//Passport
//require('./api/middlewares/passportConf')
//Set Routes
const indexRoutes = require('./api/routes/');
const adminRoutes = require('./api/routes/admin');
const userRoutes = require('./api/routes/users');
const productRoutes = require('./api/routes/products');
const oauthRoutes = require('./api/routes/oauth');

//Mongoose Connection
const MongooseConnection = require('./configs/init_mongoDb');
//Redis Connection
const RedisConnection = require('./configs/initRedis');

//Middlewares
app.use(logger('dev'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret:'sessionSecret',
    saveUninitialized:true,
    resave:true
    //cookie:{path:'/',httpOnly:true,secure:true,maxAge:60000}
  })
)
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

//passport initialize & session
app.use(passport.initialize());
app.use(passport.session());

//Routes Testing
app.all('/test',(req,res,next)=>{
  console.log(req.query)
  res.send(req.query)
})

//Routes
app.use('/',indexRoutes)
app.use('/admin',adminRoutes);
app.use('/users',userRoutes);
app.use('/products',productRoutes);
app.use('/oauths',oauthRoutes);
app.use('/logout',(req,res) => {
  req.logout();
  res.send("Logged Out")
});
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
