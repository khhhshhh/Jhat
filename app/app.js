var express = require('express')
  , MongoStore = require('connect-mongo')(express)
  , routes = require('./routes')
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

  app.use(express.bodyParser());
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

app.get('/', routes.index);

app.get('/layout', routes.layout);

app.get('/signup', routes.signup);

app.get('/profile', routes.profile);

app.get('/profileUpdate', routes.profileUpdate);

app.post('/profileUpdate', user.profileUpdate);

app.get('/signin', routes.signin);

app.post('/signin', user.signin);

app.get('/signout', routes.signout);

app.post('/userCreate', user.create);

app.post('/userRemove', user.remove);

app.get('/passwordUpdate', routes.passwordUpdate);

app.post('/passwordUpdate', user.passwordUpdate);

app.get('/friendSeeking', routes.friendSeeking);

app.post('/addFriend', user.addFriend);

app.get('/friendsList', routes.friendsList);

app.post('/removeFriend', user.removeFriend);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
