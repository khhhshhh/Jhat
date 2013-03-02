var User = require('../models/user');

exports.index = function(req, res) {
	var u = req.session.user || null;
	res.render('index', {
		user: u
	});
};

exports.layout = function(req, res) {
	res.render('layout');
};

exports.signup = function(req, res) {
	User.find({}, function(err, us) {
		res.render('signup', {
			users: us
		});
	});
};

exports.signin = function(req, res) {
	res.render('signin');
};

exports.signout = function(req, res) {
	req.session.user = null;
	res.render('index', {
		user: null
	});
};

exports.profile = function(req, res) {
	res.render('profile', {
		user: req.session.user
	});
};

exports.profileUpdate = function(req, res) {
	res.render('profileUpdate', {
		user: req.session.user
	});
};

exports.passwordUpdate = function(req, res) {
	res.render('passwordUpdate', {
		user: req.session.user
	});
};

exports.friendSeeking = function(req, res) {
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

exports.friendsList = function(req, res) {
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
