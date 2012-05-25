//the controllers & all actions in the controllers.


exports = module.exports = function(app, io){

  var dish = require('./controllers/dish');
  var bill = require('./controllers/bill')({'app':app, 'io':io});
  var board = require('./controllers/board')({'app':app, 'io':io});
  var index = require('./controllers/index');
  var pad_update = require('./controllers/pad_update');

  app.get('/client', index.index);
  app.get('/dish/:id?', dish.get_dish);
  app.post('/bill/add_bill', bill.add_bill);
  app.get('/pad_update/menu_data', pad_update.dish_data);
  app.get('/pad_update/get_md5', pad_update.get_md5);

  app.get('/board/waiter', board.waiter);
};
