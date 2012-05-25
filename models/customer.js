var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var CustomerSchema = new Schema({
	flag: {type: String}, //user typ : [phone|pad]
	phone_number: {type: String, default: ''},
  desk_id: {type: String, default: ''},
  employee_id: {type: String, default: ''},
  customer_count: {type: Number, default: -1},
	create_at: {type: Date, default: Date.now}
});

mongoose.model('Customer', CustomerSchema);
