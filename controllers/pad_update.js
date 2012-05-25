//for download some specifilc files
//

var fs = require('fs');

function download_dish_data(req, res, next){
  fs.readFile('/swidy/data/dish.js', function(err, data){
    if (err) next(err);
    res.setHeader('Content-Length', data.length);
    console.log(data.length);
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    var dish = data.toString();
    res.write(dish);
    res.end();
  });
}

function get_md5(req, res, next){
  fs.readFile('/swidy/data/latestMd5.dat', function(err, data){
    if(err) next(err);
    var md5 = data.toString().replace(/^\s\s*/g, '');
    res.send(md5);
  });
}

exports.get_md5 = module.exports.get_md5 = get_md5;
exports.dish_data = module.exports.dish_data = download_dish_data;

