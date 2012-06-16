var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
var BillSchema = new Schema({
	bill_data: {type: String},
  customer_id: {type: ObjectId},
  total_cost: {type:Number, default: 0.0},
	description: {type: String, default: ''},
  bill_confirmed : {type:Boolean, default: false},
  bill_finished : {type:Boolean, default: false},
  customer_count : {type:Number, default: 1},
  avoid_info : {type: String, default: ''},
  attend_time: {type: Date, default: Date.now},
  order_confirm_id: {type: String},
	create_at: {type: Date, default: Date.now}
});

mongoose.model('Bill', BillSchema);
