var debug = require('debug')('blogBE:container.js');
var fs = require('fs');
// var piexifjs = require('piexifjs');

module.exports = function(Container) {
  Container.afterRemote('upload', function(ctx, file, next) {
    debug(file.result.files.files);
    var _arrRecordImage = [];
    file.result.files.files.forEach(function(fileItem) {
      _arrRecordImage.push({
        imgUrl: fileItem.container + "/" + fileItem.name,
        recordId: file.result.fields.recordId[0]
      });

      // if (/JPG|JPEG/.test(fileItem.name.toUpperCase())) {
      //   debug(fileItem.name);
      //   fs.readFile(__dirname + "/../../server/uploads/" + fileItem.container + "/" + fileItem.name, function(err, imageData) {
      //     var base64Image = imageData.toString('base64');
      //     var _exifObj = piexifjs.load('data:image/jpeg;base64,' + base64Image);
      //     _exifObj['0th'][piexifjs.ImageIFD.XResolution] = [300, 1];
      //     _exifObj['0th'][piexifjs.ImageIFD.YResolution] = [300, 1];
      //     debug(_exifObj);
      //     var _exifStr = piexifjs.dump(_exifObj);
      //     var _newImage = piexifjs.insert(_exifStr, base64Image);

      //     fs.writeFile(__dirname + "/../../server/uploads/" + fileItem.container + "/" + fileItem.name, _newImage, 'base64', function(err) {
      //       debug(err);
      //     });
      //   });
      // }
    });

    // save to db
    Container.app.models.recordImage.create(_arrRecordImage, {
      userId: ctx.req.accessToken.userId
    }, function(err, newArrRecordImage) {
      if (err) next(err);
      next();
    });
  });
};
