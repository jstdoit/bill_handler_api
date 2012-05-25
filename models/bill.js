var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
	
var BillSchema = new Schema({
	bill_data: {type: String},
  customer_id: {type: ObjectId},
  total_cost: {type:Number},
	description: {type: String, default: ''},
  bill_confirmed : {type:Boolean, default: false},
	create_at: {type: Date, default: Date.now}
});

mongoose.model('Bill', BillSchema);
