var User = require('../models/user'); 

module.exports = function(app) {
	app.get('/jhat/loadTemplate', function(req, res) {
		var user = req.session.user;
		var me = {};

		for(var i in user) {
			if(i =='friends' || i == 'password' || i == '__v') {
				continue;
			} else {
				me[i] = user[i];
			}
		}

		User.find({
			_id: {$in : user.friends} 
		}, {
			__v: 0,
			password: 0,
			friends: 0
		} ,function(err, friends) {
			if(err) console.log('Find friends error');
			else {
				render(friends);
			}
		});

		function render(friends) {
			res.render('jhat', {
				user: user,
				me: me,
				friends: friends
			});
		};
	});
};
