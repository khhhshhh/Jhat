var mongoose = require('../db'); 
var db = mongoose.connection;
var Schema = mongoose.Schema;


db.on('open', function() {
	console.log('Users db connect');
});

db.on('error', function() {
	console.log('Users db error');
});

// User's Schema
var user = Schema({
	age: Number
	, name: String
	, nickname: String
	, profile: String
	, gender: String
	, password: String
	, email: String
	, friends: Array
	, extName: String
});

// 通过用户名可以找到用户
user.statics.findByName = function(n, cb) {
	this.findOne({name: n}, cb);
};

var User = mongoose.model('User', user);
module.exports = User;
