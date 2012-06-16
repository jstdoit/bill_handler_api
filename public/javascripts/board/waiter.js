function render_bill(data, socket){

  var bill = $.parseJSON(data.bill);
  var count = data.totalCount;
  $('p#bill-count').text('当前总共有未读订单' + count  + '份');
  if ($('#' + data.bill_id).length != 0){
    return;
  }

  var user = $.parseJSON(data.user);
  var now = new Date(data.datetime);
  var ctner = $('#bill-ctner');
  var is_finished = (data.is_finished == undefined?false:data.is_finished);

  var html = '';
  html += '<div id="' + data.bill_id + '" class="bill">';
  html += '<span class="summary">' + '总计:' + data.totalCost + '元,';

  if(user.flag == 'phone') {
    html += '联系电话:' + (user.phoneNumber==undefined?user.phone_number:user.phoneNumber) + ',' + data.attendee_count + '人</span>';
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
  html += '</ul><hr/><button class="confirm_bill_btn" value="' + data.bill_id  + '">关闭</button><button value="' + data.bill_id + '" ' + (is_finished?'disabled':'')+ ' class="finish_bill_button">' + (is_finished?'已结算':'结算') + '</button> </div>';
  
  $(html).appendTo(ctner);

}
$(function(){
  var socket = io.connect(config.domain);
  var ctner = $('#bill-ctner');
  //confirm the bill
  ctner.delegate('button.confirm_bill_btn', 'click', function(){
    var o = $(this);
    if(confirm('确定将关闭该订单吗？')) {
      socket.emit('bill_confirmed', {'bill_id':o.val()});
    }
    return false;
  });
  //finish the bill
  ctner.delegate('button.finish_bill_button', 'click', function(){
    var o = $(this);
    if(confirm('确定要结算该订单吗？')){
      socket.emit('bill_finished', {'bill_id':o.val()});
    }
    return false;
  });
  //bill_confirm_done
  socket.on('bill_confirm_done', function(data){
    var bId = data.bId;
    $('div#' + bId).slideUp('normal', function(){
      var o = $(this);
      o.remove();
    });
  });
  //bill finished done
  socket.on('bill_finished_done', function(data){
    var bId = data.bId;
    $('div#' + bId + '>button.finish_bill_button').attr('disabled', true).text('已结算');
  });
  //bill added event
  socket.on('bill_added', function(data){
    console.log(data);
    render_bill(data, socket);
  });
});
