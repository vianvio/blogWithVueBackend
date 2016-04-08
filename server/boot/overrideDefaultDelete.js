module.exports = function(app) {
  // console.log(app.models);
  // for (key in app.models) {
  //   app.models[key].deleteById = (function(_key) {
  //     return function(id, cb) {
  //       app.models[_key].upsert({
  //         id: id,
  //         bDisabled: true
  //       }, function(err, obj) {
  //         cb(err, {
  //           deleted: obj
  //         });
  //       });
  //     };
  //   })(key);
  // }
};
