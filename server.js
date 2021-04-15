const http = require('http');
const app = require('./app');
const server = http.createServer(app);
require('./configs/index')(app);

server.listen(app.get('port'),() => {
    console.log('## server is running at port: '+app.get('port')+' ##');
    return true;
  }
)
