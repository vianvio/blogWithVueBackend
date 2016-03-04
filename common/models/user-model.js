'use strict';
var debug = require('debug')('blogBE:user-model.js');

module.exports = function(UserModel) {
  UserModel.afterRemote('create', function(ctx, userModel, next) {
    ctx.result = {
      bError: false,
      message: '注册成功',
      result: userModel
    }
    next();
  });

  UserModel.beforeRemote('login', function(ctx, credential, next) {
    ctx.args.credentials.ttl = 3600;
    next();
  });

  UserModel.afterRemote('login', function(ctx, userModel, next) {
    UserModel.findById(userModel.userId, function(err, user) {
      if (err) next(err);
      ctx.result.username = user.username;
      next();
    });
  });
};
