//export the action in this controller.
//

var app = null;
var io = null;
var fs = require('fs');
var apk_version_path = '/swidy/client/version.json';
var apk_file_path = '/swidy/client/xiangcao.apk';

module.exports = exports = function(params){
  app = params.app;
  io = params.io;
  return exports;
}

//add bill
function update_apk(req, res, next){
  var action = req.params.action;
  if (action == 'ver'){
    var data = fs.readFileSync(apk_version_path, 'utf-8');
    var length = Buffer.byteLength(data, 'utf-8');
    res.setHeader('Content-Length', length);
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.setHeader('Connection', 'Keep-Alive');
    res.send(data);
  } else if (action == 'download'){
    res.download(apk_file_path);
  }
}

exports.update_apk = update_apk;
