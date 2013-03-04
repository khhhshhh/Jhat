var express = require('express')
  , MongoStore = require('connect-mongo')(express)
  , routes = require('./routes')
  , jhat = require('./routes/jhat')
  , user = require('./routes/user')
  , http = require('http')
  , mongoose = require('mongoose')
  , path = require('path')
  ,	settings = require('./settings');

var User = require('./models/user');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8080);

  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  
  app.use(express.favicon());
  app.use(express.logger('dev'));

  app.use(express.bodyParser({
	  /*Upload files settings*/
	  //uploadDir: __dirname + '/public/upload_tmp/',
  }));

  app.use(express.methodOverride());
  app.use(express.cookieParser());

  app.use(express.session({
	  secret: 'jhat',
	  store: new MongoStore({
		  url: settings.url + '/admin/sessions',
	  })
  }));

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

});

/*Router of navigation*/
routes(app);

/*Router of user's Ajax */
user(app);

/*Router of jhat's main chating capility*/
jhat(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
