var mongoose = require('mongoose'),
	config= require('../config.default').config;

	
mongoose.connect(config.db, function(err){
	if(err){
		console.log('connect to db error: ' + err.message);
		process.exit(1);
	}
});


// models
require('./bill');
require('./customer');


exports.Bill = mongoose.model('Bill');
exports.Customer = mongoose.model('Customer');
