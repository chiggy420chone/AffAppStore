const path = require('path');
const expressHandlebars = require('express-handlebars');

module.exports = function(config){
  config.set('trust proxy',true);
  config.set('port',process.env.PORT || 3000);
  config.set('views',path.join(__dirname,'../ends/views/'));
  config.engine('hbs',expressHandlebars({
      extname:'hbs',
      defaultLayout:'layout',
      layoutsDir:path.join(__dirname,'../ends/views/layouts'),
      partialsDir:path.join(__dirname,'../ends/views/partials')
    })
  );
  config.set('view engine','hbs');
}
