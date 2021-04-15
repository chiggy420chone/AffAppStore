const mongoose = require('mongoose');
const db = require('./keys').MongoURI;

mongoose.Promise = global.Promise;
mongoose.connect(db,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})
  .then(function(){
    console.log("## Mongoose Connecting to MongoDB Atlas... ##");
  }).catch(function(err){
    console.log(err.message)
  })
  mongoose.set('useCreateIndex',true);
  mongoose.connection.on('open',function(){
    console.log("## Mongoose Connection Open On Process: "+process.pid+" ##")
  })
  mongoose.connection.on('connected',() => {
    console.log('## Mongoose Connected To The Database ##')
  })
  mongoose.connection.on('error',(err) => {
    console.log(err.message)
  })
  mongoose.connection.on('disconnected',() => {
    console.log("## Mongoose Connection Is Disconnected ##")
  })

  process.on('SIGINT',async () => {
    await mongoose.connection.close(() => {
      console.log("Mongoose Connection Is Closed")
    })
    process.exit(0)
  })
