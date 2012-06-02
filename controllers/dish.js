//export the action in this controller.
//

var dish_path = '/swidy/data/dishes/';
var fs = require('fs');

function get_dish(req, res, next){
  var dish_id = req.params.id;
  if (dish_id == undefined){
    res.json({'ERR':'sorry!the dish id must be valid'});
    return;
  }

  var dish_file = dish_path + dish_id + '.js';

  var data = fs.readFileSync(dish_file, 'utf-8')
  var length = Buffer.byteLength(data, 'utf8');
  res.setHeader('Content-Length', length);
  res.setHeader('Content-Type', 'text/plain;charset=utf-8');
  res.setHeader('Connection', 'Keep-Alive');
  res.send(data);
};


exports.get_dish = module.exports.get_md5 = get_dish;
