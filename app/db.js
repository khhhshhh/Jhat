var settings = require('./settings');
var mongoose = require('mongoose');
mongoose.connect(settings.url);
module.exports = mongoose;
