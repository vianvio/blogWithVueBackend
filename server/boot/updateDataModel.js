var debug = require('debug')('blogBE:updateDataModel.js');
module.exports = function(app) {
  app.datasources.mysql.autoupdate();
};
