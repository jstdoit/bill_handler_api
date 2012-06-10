//the controllers & all actions in the controllers.


exports = module.exports = function(app, io){

  var dish = require('./controllers/dish');
  var bill = require('./controllers/bill')({'app':app, 'io':io});
  var board = require('./controllers/board')({'app':app, 'io':io});
  var index = require('./controllers/index');
  var pad_update = require('./controllers/pad_update');
  var phone_update = require('./controllers/phone_update');
  var pic_handler = require('./controllers/pic_handler');
  var apk = require('./controllers/apk');

  app.get('/client', index.index);
  app.get('/shop/:shop_id/dish/:id?', dish.get_dish);
  app.post('/bill/add_bill', bill.add_bill);
  app.get('/pad_update/menu_data', pad_update.dish_data);
  app.get('/pad_update/get_md5', pad_update.get_md5);
  app.get('/phone_update/branch_data', phone_update.branch_data);
  app.get('/phone_update/get_md5', phone_update.get_md5);
  app.get('/shop/:shop_id/pic/:pic_name/:pic_size?', pic_handler.get_pic);

  app.get('/apk/:action', apk.update_apk);

  app.get('/board/waiter', board.waiter);
};
