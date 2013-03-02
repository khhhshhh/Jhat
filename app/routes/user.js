var User = require('../models/user');
var crypto = require('crypto');

function md5(password) {
	var hash = crypto.createHash('md5');
	return hash.update(password).digest('hex');
}

exports.create = function(req, res) {
	/*Model: C.create({}, function(err, doc){});*/
	req.body.password = md5(req.body.password);
	User.create(req.body, function(err, user) {
		if(err) res.send('used');
		res.json(user.toObject());
	});
};

exports.remove = function(req, res) {
	User.findByIdAndRemove(req.body._id, function(err, what) {
		if(err) res.send(err);
		else {
			res.send('ok');
		}
	});
};

exports.signin = function(req, res) {
	User.findByName(req.body.name, function(err, user) {
		if(user) {
			req.session.user = user;
			res.send((user.password == md5(req.body.password) ? 'OK' : 'Password is not correct'));
		} else {
			res.send('User is not found, please check your name');
		}
	});
};

exports.profileUpdate = function(req, res) {
	if(req.session.user) {
		var body = req.body;
		var user = req.session.user;

		User.findByIdAndUpdate(user._id, {
			name: body.name
			,nickname: body.nickname
			,email: body.email
			,gender: body.gender
			,age: body.age
			,profile: body.profile
		}, function(err, newUser){
			if(err) res.send('Error');
			else {
				req.session.user = newUser; 
				res.redirect('/profile');
			}
		});
	} else {
		res.redirect('/signin');
	}

};

exports.passwordUpdate = function(req, res) {
	var opsw = md5(req.body.opassword);
	var user = req.session.user;

	if(opsw !== user.password) {
		res.send('Old password is not correct');
	} else {
		var npsw = md5(req.body.npassword);
		User.findByIdAndUpdate(user._id, {
			password: npsw
		}, function(err, newUser){
			if(err) res.send('Update failed');
			else {
				req.session.user = newUser;
				res.send('Update successfully');
			}
		});
	}

};

/*Use $addToSet to add new friend*/
exports.addFriend = function(req, res) {
	var id = req.body.id; 
	User.findByIdAndUpdate( // Add him / her as my friend
			req.session.user._id 
			,{$addToSet: {friends: id}} 
			,function(err, me) {
				if(err) res.send('Add falied');
				else {
					User.findByIdAndUpdate( // Add me as her / his friend
							id
							,{$addToSet: {friends: req.session.user._id}} 
							,function(err, friend) {
								if(err) res.send('Add falied');
								else {
									req.session.user = me;
									res.send('OK');
								}
							});
				}
			});

};

/*$pull to delete a friend*/
exports.removeFriend = function(req, res) {
	var user = req.session.user;
	var friendId = req.body.id;
	User.findByIdAndUpdate(user._id, {$pull: {friends: friendId}}, function(err, me) {
		if(err) res.send('Remove failed');
		else {
			User.findByIdAndUpdate(friendId, {$pull: {friends: user._id}}, function(err, doc) {
				if(err) res.send('Remove failed');
				else {
					req.session.user = me;
					res.send('OK');
				}
			});
		}
	});
};
exports.md5 = md5;
