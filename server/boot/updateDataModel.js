var debug = require('debug')('blogBE:updateDataModel.js');
module.exports = function(app) {
  app.models.userModel.dataSource.autoupdate();
};
