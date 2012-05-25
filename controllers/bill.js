//export the action in this controller.
//

var app = null;
var io = null;
var models = require('../models'),
  Customer = models.Customer,
  Bill = models.Bill;

module.exports = exports = function(params){
  app = params.app;
  io = params.io;
  return exports;
}

//add bill
function add_bill(req, res, next){
  
  var bill = JSON.parse(req.body.bill);
  var datetime = new Date().toString();

  if(bill == '') {
    res.json({'ERR':'Bill data should not be empty'});
  } else if(req.method.toLowerCase == 'get') {
    res.json({'ERR':'you should submit from valid devices'});
  }
  // customer save
  var _customer = new Customer();
  _customer.flag = bill.user.flag;
  if(bill.user.flag == 'phone'){
    Customer.find({'phone_number':bill.user.phoneNumber}, function(err, custs){
      if(err) next(err);
      console.dir(custs);
      if(custs.length > 0){
        _customer = custs[0];
      } else {
        _customer.phone_number = bill.user.phoneNumber;
        _customer.save();
      }
    });
  } else {
    _customer.desk_id = bill.user.deskId;
    _customer.employee_id = bill.user.employeeId;
    _customer.customer_count = parseInt(bill.user.customerCount);
    _customer.save();
  }
    //bill save
  var _bill = new Bill();
  _bill.bill_data = bill.category;
  _bill.customer_id = _customer._id;
  _bill.total_cost = parseInt(bill.totalCost);
  _bill.save(function(err){
    if(err) res.json({'ERR':'SUBMIT_BILL_FAILED'});
    io.sockets.in('baizhouxiang').emit('bill_added',{'bill_id':_bill._id.toString() ,
                                 'bill' : JSON.stringify(bill.category), 
                                 'user' : JSON.stringify(bill.user), 
                                 'datetime' : datetime, 
                                 'totalCost':bill.totalCost
                                 });
  });

  res.json({'OK':'SUCC'});
}

exports.add_bill = add_bill;
