//the management board controller.

var app = null;
var io = null;
var models = require('../models'),
  ObjectId = require('mongoose').Types.ObjectId,
  Bill = models.Bill,
  Customer = models.Customer; 
var EventProxy = require('eventproxy').EventProxy;

module.exports = exports = function(params){
  app = params.app;
  io = params.io;
  return exports;
}

function send_unread_bill(client){

    var proxy = new EventProxy();
    var noti = function(count, bill, customer){
      client.emit('bill_added', {'bill_id':bill._id.toString() ,
                       'bill' : bill.bill_data, 
                       'is_finished': bill.bill_finished,
                       'user' : JSON.stringify(customer), 
                       'totalCount' : count,
                       'attendee_count' : bill.customer_count,
                       'datetime' : new Date(bill.create_at), 
                       'totalCost':bill.total_cost });
    }
    proxy.assign('count', 'bill', 'customer', noti);

    Bill.count({bill_confirmed : false}, function(err, count){
      proxy.trigger('count', count);
    });

    Bill.findOne({bill_confirmed : false}, function(err, bill, bd){
      if(bill != null){
        proxy.trigger('bill', bill);
        Customer.findOne({_id:bill.customer_id}, function(err, customer, bd){
          proxy.trigger('customer', customer);
        });
      }
    });
}


function waiter(req, res, next){
  io.sockets.on('connection', function(client){
    client.join('baizhouxiang');
    send_unread_bill(client);

    //bill finished event
    client.on('bill_finished', function(data){
      var bId = data.bill_id;
      Bill.update({'_id' : ObjectId.fromString(bId)}, {$set : {bill_finished : true}}, function(err, numAffected){
        if(err){
          next(err);
        } 
        io.sockets.in('baizhouxiang').emit('bill_finished_done', {'bId':bId});
      });
    });
    //bill confirmed event
    client.on('bill_confirmed', function(data){
      var bId = data.bill_id;
      Bill.update({'_id' : ObjectId.fromString(bId)}, {$set : {bill_confirmed : true}}, function(err, numAffected){
        if(err){
          next(err);
        } 
        io.sockets.in('baizhouxiang').emit('bill_confirm_done', {'bId':bId});
        send_unread_bill(client);
      });
    });
  });

  io.sockets.on('disconnect', function(){
    console.log('socket leave baizhouxiang room');
  });

  res.render('board/waiter.jade', {'title':'订单通知'});
}

exports.waiter = module.exports.waiter = waiter;
