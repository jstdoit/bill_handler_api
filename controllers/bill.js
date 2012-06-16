//export the action in this controller.
//

var app = null;
var io = null;
var models = require('../models'),
  Customer = models.Customer,
  Bill = models.Bill;
var EventProxy = require('eventproxy').EventProxy;

module.exports = exports = function(params){
  app = params.app;
  io = params.io;
  return exports;
}

//add bill
function add_bill(req, res, next){
  
  var bill = JSON.parse(req.body.bill);
  var datetime = new Date().toString();
  console.log(req.body);

  if(bill == '') {
    res.json({'ERR':'Bill data should not be empty'});
  } else if(req.method.toLowerCase == 'get') {
    res.json({'ERR':'you should submit from valid devices'});
  }
  // customer save
  var _customer = null;
  var _bill = new Bill();
  if(bill.user.flag == 'phone'){

    var customer_count = req.body.customer_count;
    var avoid_info = req.body.avoid_info;
    var attend_time = req.body.attend_time;
    var confirm_id = Math.round(Math.random() * 10000000);

    Customer.find({'phone_number':bill.user.phoneNumber}, function(err, custs){
      if(err) {
        throw err;     
      }
      if(custs.length > 0){
        _customer = custs[0];
      } else {
        _customer = new Customer();
        _customer.flag = bill.user.flag;
        _customer.phone_number = bill.user.phoneNumber;
        _customer.save();
      }
      //bill save
      _bill.customer_id = _customer._id;
      _bill.customer_count = customer_count;
      _bill.bill_data = JSON.stringify(bill.category);
      _bill.total_cost = parseInt(bill.totalCost);
      _bill.order_confirm_id = confirm_id;
      _bill.save(function(err){
        if(err) {
          res.json({'status':'ERR', 'reason':'SAVE_ERR'});
        } else {
          res.json({'status':'OK', 'order_id':confirm_id});
          io.sockets.in('baizhouxiang').emit('bill_added',{'bill_id':_bill._id.toString() ,
                                       'bill' : JSON.stringify(bill.category), 
                                       'attendee_count' : _bill.customer_count,
                                       'user' : JSON.stringify(bill.user), 
                                       'datetime' : datetime, 
                                       'totalCost':bill.totalCost
                                       });
        } 
      });
    });
  } else {
    _customer = new Customer();
    _customer.flag = bill.user.flag;
    _customer.desk_id = bill.user.deskId;
    _customer.employee_id = bill.user.employeeId;
    _customer.customer_count = parseInt(bill.user.customerCount);
    _customer.save();

    //bill save
    _bill.customer_id = _customer._id;
    _bill.bill_data = JSON.stringify(bill.category);
    _bill.total_cost = parseInt(bill.totalCost);
    _bill.save(function(err){
      if(err) {
        res.json({'status':'ERR', 'reason':'SAVE_ERR'});
      } else {
        res.json({'OK':'SUCC'});
        io.sockets.in('baizhouxiang').emit('bill_added',{'bill_id':_bill._id.toString() ,
                                     'bill' : JSON.stringify(bill.category), 
                                     'user' : JSON.stringify(bill.user), 
                                     'datetime' : datetime, 
                                     'totalCost':bill.totalCost
                                     });
      
      }
    });
  }

}


function check_finished(req, res, next) {
  var ids_to_check = req.query.ids;
  if (ids_to_check == undefined) {
    res.json({'status':'ERR', 'reason':'params needed'});
  } else {
    var ids_arr = ids_to_check.split(',');
    Bill.find({'order_confirm_id': {$in : ids_arr}}, function(err, data){
      if (err) next(err);
      var c_r = [];
      data.forEach(function(bill, index, arr){
        if(bill.bill_finished){
          c_r.push(1);
        } else {
          c_r.push(0);
        }
      });
      res.json({'status':'OK', 'data':c_r.toString()});
    });
  }
}


exports.add_bill = add_bill;
exports.check_finished = check_finished;
