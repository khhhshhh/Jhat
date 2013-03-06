var User = require('../models/user'); 

module.exports = function(app) {
	app.get('/jhat/loadTemplate', function(req, res) {
		var user = req.session.user;
		var friends = [];

		User.find({
			_id: {$in : user.friends} 
		}, {
			password: 0,
			friends: 0
		} ,function(err, friends) {
			if(err) console.log('Find friends error');
			else {
				render(user, friends);
			}
		});

		function render(user, friends) {
			res.render('jhat', {
				user: user,
				friends: friends
			});
		};
	});
};
