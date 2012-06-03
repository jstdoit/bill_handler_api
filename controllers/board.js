//the management board controller.

var app = null;
var io = null;
var models = require('../models'),
  ObjectId = require('mongoose').Types.ObjectId,
  Bill = models.Bill,
  Customer = models.Customer; 

module.exports = exports = function(params){
  app = params.app;
  io = params.io;
  return exports;
}

function send_unread_bills(client){
    var bills_data = [];

    Bill.find({bill_confirmed : false}, function(err, bills, bd){
      bills.forEach(function(bill, index, arr){
        Customer.findOne({_id : bill.customer_id}, function(err, customer){
          if (err) throw err;
          client.emit('bill_added', {'bill_id':bill._id.toString() ,
                           'bill' : bill.bill_data, 
                           'user' : JSON.stringify(customer), 
                           'datetime' : new Date(bill.create_at), 
                           'totalCost':bill.total_cost });
        });
    });
  });

  //client.emit('unread_bills',JSON.stringify(bills_data));
}
function waiter(req, res, next){
  io.sockets.on('connection', function(client){
    client.join('baizhouxiang');
    send_unread_bills(client);
    client.on('bill_confirmed', function(data){
      var bId = data.bill_id;
      Bill.update({'_id' : ObjectId.fromString(bId)}, {$set : {bill_confirmed : true}}, function(err, numAffected){
        if(err){
          next(err);
        } 
        io.sockets.in('baizhouxiang').emit('bill_confirm_done', {'bId':bId});
      });
    });
  });

  io.sockets.on('disconnect', function(){
    console.log('socket leave baizhouxiang room');
  });

  res.render('board/waiter.jade', {'title':'订单通知'});
}

exports.waiter = module.exports.waiter = waiter;
