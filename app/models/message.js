var mongoose = require('../db');
var db = mongoose.connection;
var Schema =  mongoose.Schema;

db.on('open', function() {
	console.log('Message connect');
});

db.on('error', function() {
	console.log('Message error');
});

var messageSchema = new Schema({
	from: String, // Sent from whom
	to: String,   // Send to whom
	content: String, // Message's content
	date: Date, // The date of the Message sent
	status: String // status of the message: 
				   // 1. sent 2.unsent 	 
});

module.exports = mongoose.model('message', messageSchema); 
