var debug = require('debug')('blogBE:addUserInfo.js');

module.exports = function(Model, options) {
  // observe for save in logic.
  Model.observe('before save', function(ctx, next) {
    // check user id. Since api call will also fire these, take user id as a flag
    debug('from before save. userid: %s \n ctx.instance: %s \n ctx.data: %s', ctx.options.userId, ctx.instance, ctx.data);
    if (ctx.options.userId) {
      if (!ctx.isNewInstance) {
        // update
        if (ctx.instance) {
          ctx.instance.lastUpdatedById = ctx.options.userId;
        } else {
          ctx.data.lastUpdatedById = ctx.options.userId;
        }
      } else {
        // create
        if (ctx.instance) {
          ctx.instance.ownerId = ctx.options.userId;
          ctx.instance.lastUpdatedById = ctx.options.userId;
        } else {
          ctx.data.ownerId = ctx.options.userId;
          ctx.data.lastUpdatedById = ctx.options.userId;
        }
      }
    }
    next();
  });

  // remote hook for rest api.
  Model.beforeRemote('create', function(ctx, obj, next) {
    debug('from before create. ctx.options: %s \n ctx.options.skipUserInfo: %s \n ctx.args.data: %s \n ctx.req.accessToken: %s',
      ctx.options, ctx.options.skipUserInfo, JSON.stringify(ctx.args.data), JSON.stringify(ctx.req.accessToken));
    if ((!ctx.options) || (ctx.options && ctx.options.skipUserInfo)) {
      return next();
    }
    // debug('before create: ' + ctx.args.data + ', ' + ctx.req.accessToken + ', ' + ctx.req.accessToken.userId);
    if (ctx.args.data && ctx.req.accessToken && ctx.req.accessToken.userId) {
      ctx.args.data.ownerId = ctx.req.accessToken.userId;
      ctx.args.data.lastUpdatedById = ctx.req.accessToken.userId;
      debug(JSON.stringify(ctx.args.data));
    }
    next();
  });

  Model.beforeRemote('upsert', function(ctx, obj, next) {
    debug('from upsert');
    if ((!ctx.options) || (ctx.options && ctx.options.skipUserInfo)) {
      return next();
    }
    if (ctx.args.data && ctx.req.accessToken && ctx.req.accessToken.userId) {
      ctx.args.data.lastUpdatedById = ctx.req.accessToken.userId;
    }
    next();
  });

  Model.beforeRemote('updateAll', function(ctx, obj, next) {
    debug('from updateall');
    // need confirm: data is array?
    if ((!ctx.options) || (ctx.options && ctx.options.skipUserInfo)) {
      return next();
    }
    if (ctx.args.data && ctx.req.accessToken && ctx.req.accessToken.userId) {
      ctx.args.data.forEach(function(item) {
        item.lastUpdatedById = ctx.req.accessToken.userId;
      });
    }
    next();
  });
}
