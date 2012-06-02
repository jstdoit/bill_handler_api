//for download some specifilc files
//

var fs = require('fs');

function download_branch_data(req, res, next){
  var data = fs.readFileSync('/swidy/data/latest_branch.js', 'utf-8')
  var length = Buffer.byteLength(data, 'utf8');
  res.setHeader('Content-Length', length);
  res.setHeader('Content-Type', 'text/plain;charset=utf-8');
  res.setHeader('Connection', 'Keep-Alive');
  res.send(data);
}

function get_md5(req, res, next){
  fs.readFile('/swidy/data/latestMd5.dat', function(err, data){
    if(err) next(err);
    var md5 = data.toString().replace(/^\s\s*/g, '');
    res.send(md5);
  });
}

exports.get_md5 = module.exports.get_md5 = get_md5;
exports.branch_data = module.exports.branch_data = download_branch_data;

