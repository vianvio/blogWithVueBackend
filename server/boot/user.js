module.exports = function(app) {
  delete app.models.userModel.validations.email;
};
