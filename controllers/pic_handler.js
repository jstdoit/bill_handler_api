var util = require('util');
var im = require('imagemagick');
var fs = require('fs');
var src_prefix = '/swidy/data/yuncaipu/cust/3/images/original/';
var target_prefix = '/swidy/data/yuncaipu/cust/3/images/client/';

function get_pic(req, res, next){
  //TODO: implementation of the picture handling
  //
  var name = req.params.pic_name;
  var size = req.params.pic_size || '300x150';

  resize_image(res, name, size.split('x'));
}

function resize_image(res, name, image_to_rect){
  var result_path = target_prefix + name + '_' + image_to_rect.join('x');
  var src_path = src_prefix + name + '.jpg';
  fs.stat(result_path, function(err, stat){
    if (err != null) {
      im.resize({
        srcPath: src_prefix + name + '.jpg',
        dstPath: result_path,
        width:   image_to_rect[0]
      }, function(err, stdout, stderr){
        if (err) {
          console.log(src_path + ' image not found');
          return;
        }
        console.log('write to ' + result_path);
        //send image data to client
        res.writeHead(200, {'Content-Type': 'image/jpeg'});
        var imageStream = fs.createReadStream(result_path, { flags: 'r', encoding: null, fd: null, mode: 0666, bufferSize: 64 * 1024 });
        imageStream.pipe(res);
      });
    } else {
      //send image data to client
      var imageStream = fs.createReadStream(result_path, { flags: 'r', encoding: null, fd: null, mode: 0666, bufferSize: 64 * 1024 });
      imageStream.pipe(res);
    }
  });
}
exports.get_pic = module.exports.get_pic = get_pic;

