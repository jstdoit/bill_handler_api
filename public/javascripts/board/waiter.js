function render_bill(data, socket){
  var cls = 'noprice';
  var reserve_time = new Date(data.attend_time);
  var is_reserve = (reserve_time.getFullYear() == 1970)?false:true;

  var desk_id = data.desk_id;
  var waiter_id = data.waiter_id;

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
  html += '<span class="summary block">' + '总计:' + data.totalCost + '元,';

  if(user.flag == 'phone') {
    html += '联系电话:' + (user.phoneNumber==undefined?user.phone_number:user.phoneNumber) + ', ' + data.attendee_count + '人</span>';
  } else if(user.flag == 'pad') {
    html += '餐桌号:' + user.deskId + ',服务员号:' + user.employeeId + ',客人数' + user.customerCount + '</span>';
  }

  html += '<span class="dt block">' + '订单提交日期:' + now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' '+ now.getHours() + ':' + (now.getMinutes()<10?'0'+now.getMinutes():now.getMinutes()) + ':' + (now.getSeconds()<10?'0' + now.getSeconds():now.getSeconds())+ '</span>';
  html += '<span class="bill-type block">' + '<span class="bill-t">订单类型:' + (is_reserve?'预约(到达时间：' + reserve_time.getFullYear() + '-' + (reserve_time.getMonth() + 1) + '-' + reserve_time.getDate() + ' '+ reserve_time.getHours() + ':' + (reserve_time.getMinutes()<10?'0'+reserve_time.getMinutes():reserve_time.getMinutes()) + ':' + (reserve_time.getSeconds()<10?'0' + reserve_time.getSeconds():reserve_time.getSeconds())+ ')':'在店, </span>桌号: <span class="desk-id">' + desk_id + '</span><span class="bill-t">, 服务员号: ' + waiter_id) + '</span></span>';
  html += '<span class="block avoid-info">忌口:' + data.avoid_info.split('|').join(', ') + "</span><br/>";
  html += '<hr/>';
  var list_data = '<ul class="dish-list ' + cls + '">';
  //category foreach
  $.each(bill, function(i, cat){
    list_data += '<li class="category">' + cat.categoryName + "</li>";
    //dish foreach
    $.each(cat.dishes, function(i, dish){
      list_data += '<li class="dish"><span class="dish-detail"><span class="code">' + (i + 1) + '. (编号:' + dish.dishId + ')</span>' + dish.dishName + '</span><span class="dish-detail">';
      if(dish.prices.length == 1) {
        list_data += '&times;' + dish.prices[0].pCount + ' <span class="' + cls + '">&times;' + dish.prices[0].pPrice + '元</span>';
      } else {
        //price foreach
        $.each(dish.prices, function(i, price){
          if(price.pCount != 0) {
            list_data += '<p class="price">' + price.pTag + '&times;' + price.pCount + ' <span class="' + cls + '">&times;' + price.pPrice + '元</span></p>';
          }
        });
      }
      list_data += '</span>';
      if(dish.delay == 'True') {
        list_data += '<span class="delay">等叫</span>';
      }
      list_data += '</li>';
    });
  });
  list_data += '</ul>';
  html += list_data;
  html += '<p class="total-cost">合计:' + data.totalCost + '元 </p>';

  var i;
  list_data = list_data.replace(/noprice/gi, 'cls-noprice');
  for(i=0;i<3;++i){
    html += '<div class="cls-noprice h-desk-id">桌号: <span class="desk-id">' + desk_id + '</span></div>';
    html += '<div class="avoid-info cls-noprice">忌口:' + data.avoid_info.split('|').join(', ') + "</div>";
    html += list_data;
  }

  html += '<hr/>' + '<button class="confirm_bill_btn" value="' + data.bill_id  + '">关闭</button>' 
                       + '<button value="' + data.bill_id + '" ' + (is_finished?'disabled':'')+ ' class="finish_bill_button">' + (is_finished?'已结算':'结算') + '</button> ' 
                       + '<button class="print_bill">打印该订单</button>'
  + '</div>';
  
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
  //print bill
  ctner.delegate('button.print_bill', 'click', function(){
    var o = $(this);
    o.parent().printArea();
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
    render_bill(data, socket);
    console.log(data);
  });
});
