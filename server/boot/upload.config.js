module.exports = function(app) {
  app.dataSources.projectFile.connector.getFilename = function(file, req, res) {
    var arrNameSplit = file.name.split('.');
    var extension = arrNameSplit[arrNameSplit.length - 1];
    return (new Date()).getTime() + '_' + req.accessToken.userId + '.' + extension;
  };
}
