//the management board controller.

var app = null;
var io = null;
var models = require('../models'),
  ObjectId = require('mongoose').Types.ObjectId,
  Bill = models.Bill; 

module.exports = exports = function(params){
  app = params.app;
  io = params.io;
  return exports;
}

exports.waiter = module.exports.waiter = function(req, res, next){

  io.sockets.on('connection', function(client){
    client.join('baizhouxiang');
    client.on('bill_confirmed', function(data){
      var bId = data.bill_id;
      Bill.update({'_id' : ObjectId.fromString(bId)}, 
                  {$set : {bill_confirmed : true}}, 
      function(err, numAffected){
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
