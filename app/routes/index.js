var User = require('../models/user');
var routes = {};

module.exports = function(app) {
	routes.index = function(req, res) {
		var u = req.session.user || null;
		res.render('index', {
			user: u
		});
	};

	routes.layout = function(req, res) {
		res.render('layout');
	};

	routes.signup = function(req, res) {
		User.find({}, function(err, us) {
			res.render('signup', {
				users: us
			});
		});
	};

	routes.signin = function(req, res) {
		res.render('signin');
	};

	routes.signout = function(req, res) {
		req.session.user = null;
		res.render('index', {
			user: null
		});
	};

	routes.profile = function(req, res) {
		res.render('profile', {
			user: req.session.user
		});
	};

	routes.profileUpdate = function(req, res) {
		res.render('profileUpdate', {
			user: req.session.user
		});
	};

	routes.passwordUpdate = function(req, res) {
		res.render('passwordUpdate', {
			user: req.session.user
		});
	};

	routes.friendSeeking = function(req, res) {
		var user = req.session.user;
		User.find({ // find all the users that not himself
			_id: {$ne: user._id},
			/*This is a confusing problem,
			 * */
			//friends: {$elemMatch: {$nin: user.friends}}
		}).exec(function(err, users) { 
			res.render('friendSeeking', {
				user: user,
				users: users || err
			});
		});
	};

	routes.friendsList = function(req, res) {
		var user = req.session.user;
		User.find({_id: {$in: user.friends}}, function(err, friends) {
			if(err) res.send(err);
			else {
				res.render('friendsList', {
					friends: friends,
					user: user
				});
			}
		});
	}; 

	app.get('/', routes.index);

	app.get('/layout', routes.layout);

	app.get('/signup', routes.signup);

	app.get('/profile', routes.profile);

	app.get('/profileUpdate', routes.profileUpdate);

	app.get('/signout', routes.signout);

	app.get('/signin', routes.signin);

	app.get('/passwordUpdate', routes.passwordUpdate);

	app.get('/friendsList', routes.friendsList);

	app.get('/friendSeeking', routes.friendSeeking);
};
