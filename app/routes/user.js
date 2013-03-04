var User = require('../models/user');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var user = {};

function md5(password) {
	var hash = crypto.createHash('md5');
	return hash.update(password).digest('hex');
}

module.exports =  function(app) {
	user.create = function(req, res) {
		/*Model: C.create({}, function(err, doc){});*/
		req.body.password = md5(req.body.password);
		User.create(req.body, function(err, user) {
			if(err) res.send('used');
			res.json(user.toObject());
		});
	};

	user.remove = function(req, res) {
		User.findByIdAndRemove(req.body._id, function(err, what) {
			if(err) res.send(err);
			else {
				res.send('ok');
			}
		});
	};

	user.signin = function(req, res) {
		User.findByName(req.body.name, function(err, user) {
			if(user) {
				req.session.user = user;
				res.send((user.password == md5(req.body.password) ? 'OK' : 'Password is not correct'));
			} else {
				res.send('User is not found, please check your name');
			}
		});
	};

	user.profileUpdate = function(req, res) {
		if(req.session.user) {
			var body = req.body;
			var user = req.session.user;

			var avatar = req.files.avatar;
			var tmpFile = avatar.path;
			var extName = path.extname(avatar.name);
			var avatarDir = path.join(__dirname, '../public/img/avatar'); 
			var targetFile = path.join(avatarDir, user._id + extName);

			var extList = ['.jpg', '.png', '.gif'];

			var size = avatar.size;

			/*check if a string is in a list*/
			function isIn(ext, arr) {
				for(var i = 0, len = arr.length; i < len; i++) {
					if(arr[i] == ext) return true;
				};
				return false;
			};

			/*Check if the extName & size of file are ligal 
			 * type must be : jpg, png, gif
			 * size must be : <= 2MB 
			 * */
			if(isIn(extName, extList) && size <= 102400) {
				var prevAvatar = path.join(avatarDir, user._id + user.extName);
				fs.exists(prevAvatar, function(exists) { 
					if(exists) {
						fs.unlink(prevAvatar, function(err) { //delete previous avatar
							if(err) console.log('Remove avatar error');
							else updateFile(updateInfo); 						
						});
					} else {
						updateFile(updateInfo);					
					}
				});
			} else {
				console.log('File error' + isIn(extName, extList) + size); 
				res.send('File error'); // else send an error message
			}

			/*Upload file handler*/
			function updateFile(cb) {
				fs.rename(tmpFile, targetFile, function(err) {
					if(err) {
						console.log('Rename upload file error');
						console.log(targetFile);
						res.send(err);
					}
					else {
						fs.exists(tmpFile, function(exists) {
							if(exists) {
								fs.unlink(tmpFile, function(err) {
									if(err) {
										console.log('Unlink file error');
										res.send(err);
									}
									else cb();
								});
							} else {
								cb();
							}
						});
					}
				});
			}

			function updateInfo() {
				User.findByIdAndUpdate(user._id, {
					name: body.name
					,nickname: body.nickname
					,email: body.email
					,gender: body.gender
					,age: body.age
					,profile: body.profile
					,extName: extName
				}, function(err, newUser){
					if(err) res.send('Error');
					else {
						req.session.user = newUser; 
						res.redirect('/profile');
					}
				});
			}

		} else {
			res.redirect('/signin');
		}

	};

	user.passwordUpdate = function(req, res) {
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
	user.addFriend = function(req, res) {
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
	user.removeFriend = function(req, res) {
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

	user.md5 = md5;

	app.post('/profileUpdate', user.profileUpdate);


	app.post('/signin', user.signin);


	app.post('/userCreate', user.create);

	app.post('/userRemove', user.remove);


	app.post('/passwordUpdate', user.passwordUpdate);


	app.post('/addFriend', user.addFriend);

	app.post('/removeFriend', user.removeFriend);
};
