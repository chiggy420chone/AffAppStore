const redis = require('redis');

const client = redis.createClient({
  port:6379,
  host:"127.0.0.1"
})

client.on('connect',() => {
  console.log("client connected to the redis...")
})

client.on('ready',() => {
  console.log("client is ready to use on redis")
})

client.on('error',(err) => {
  console.log(err.message)
})

client.on('end',() => {
  console.log("client is disconnected from redis")
})

process.on('SIGINT',() => {
  client.quit()
})

module.exports = client;
