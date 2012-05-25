$(function(){
  var socket = io.connect(config.domain);
  var ctner = $('#bill-ctner');
  socket.on('bill_confirm_done', function(data){
    var bId = data.bId;
    $('div#' + bId).slideUp('normal', function(){
      $(this).remove();
    });
  });
  socket.on('bill_added', function(data){
    var bill = $.parseJSON(data.bill);
    var user = $.parseJSON(data.user);
    var now = new Date();

    var html = '';
    html += '<div id="' + data.bill_id + '" class="bill">';
    html += '<span class="summary">' + '总计:' + data.totalCost + '元,';

    if(user.flag == 'phone') {
      html += '联系电话:' + user.phoneNumber + '</span>';
    } else if(user.flag == 'pad') {
      html += '餐桌号:' + user.deskId + ',服务员号:' + user.employeeId + ',客人数' + user.customerCount + '</span>';
    }

    html += '<span class="dt">' + '提交日期:' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' '+ now.getHours() + ':' + (now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes()) + ':' + (now.getSeconds()<10?'0' + now.getSeconds():now.getSeconds())+ '</span>';
    html += '<hr/>';
    html += '<ul class="dish-list">';
    //category foreach
    $.each(bill, function(i, cat){
      html += '<li class="category">' + cat.categoryName + "</li>";
      //dish foreach
      $.each(cat.dishes, function(i, dish){
        html += '<li class="dish"><span class="dish-detail">' + (i + 1) + '. (编号:' + dish.dishId + ')' + dish.dishName + '</span><span class="dish-detail">';
        if(dish.prices.length == 1) {
          html += dish.prices[0].pCount + '份';
        } else {
          //price foreach
          $.each(dish.prices, function(i, price){
            html += '<p class="price">' + price.pTag + ':' + price.pCount + '份</p>';
          });
        }
        html += '</span>';
        if(dish.delay == 'True') {
          html += '<span class="delay">等叫</span>';
        }
        html += '</li>';
      });
    });
    html += '</ul><hr/><button id="confirm_bill_btn" value="' + data.bill_id  + '">确认该订单</button> </div>';
    
    $(html).appendTo(ctner);
    //confirm the bill
    ctner.delegate('button#confirm_bill_btn', 'click', function(){
      var o = $(this);
      socket.emit('bill_confirmed', {'bill_id':o.val()});
      return false;
    });
  });

});
