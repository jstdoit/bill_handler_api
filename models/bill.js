var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;
var BillSchema = new Schema({
	bill_data: {type: String},
  customer_id: {type: ObjectId},

  desk_id : {type: String, default : '-1'},
  employee_id : {type:String, default: '-1'},

  total_cost: {type:Number, default: 0.0},
	description: {type: String, default: ''},
  bill_confirmed : {type:Boolean, default: false},
  bill_finished : {type:Boolean, default: false},
  customer_count : {type:Number, default: 1},
  avoid_info : {type: String, default: ''},
  order_phone:{type:String},
  attend_time: {type: Date, default: null},
  order_confirm_id: {type: String},
	create_at: {type: Date, default: Date.now}
});

mongoose.model('Bill', BillSchema);
