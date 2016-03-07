'use strict';
var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var debug = require('debug')('blogBE:main');
var bodyParser = require('body-parser');

var app = module.exports = loopback();
// add another static folder
// app.use(loopback.static(path.resolve(__dirname, '../client/venderMissed')));
// app.use(function (req, res, next){
//   // for alipay
//   if (req.url === '/paymentNotify') {
//     req.headers['content-type'] = 'application/x-www-form-urlencoded';
//   }
//   next();
// });
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

var _socketAuth = function(io) {
  require('socketio-auth')(io, {
    authenticate: function(socket, data, callback) {
        var AccessToken = app.models.AccessToken;
        //get credentials sent by the client
        var token = AccessToken.find({
          where: {
            and: [{
              userId: data.userId
            }, {
              id: data.id
            }]
          }
        }, function(err, tokenDetail) {
          if (err) throw err;
          if (tokenDetail.length > 0) {
            callback(null, true);
          } else {
            callback(null, false);
          }
        }); //find function..    
      } //authenticate function..
  });
};

var _newChildSocketObj = function(childNamespace, eventName, eventMethodName) {
  return JSON.stringify({
    childNamespace: childNamespace,
    eventName: eventName,
    eventMethodName: eventMethodName
  });
}

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    // app.start();
    app.io = require('socket.io')(app.start());
    _socketAuth(app.io);
    app.io.on('connection', function(socket) {
      debug('a user connected');
      socket.on('disconnect', function() {
        debug('user disconnected');
      });

      // socket.on('create socket with namespace', function(roomid) {
      //   console.log(roomid);
      //   // create
      //   // TODO: check existence
      //   var roomIO = app.io.of('/' + roomid);
      //   var eventName = 'chat message';
      //   var eventMethodName = 'afterGetChatMessage'; // defined on client side
      //   _socketAuth(roomIO);
      //   roomIO.on('connection', function(roomSocket) {
      //     console.log(roomid + ': a user connected');
      //     roomSocket.on('disconnect', function() {
      //       console.log(roomid + ': user disconnected');
      //     });

      //     roomSocket.on(eventName, function(msg) {
      //       console.log(msg);
      //       roomSocket.emit(eventName, msg);
      //     });
      //   });
      //   // after create

      //   socket.emit('child socket created', _newChildSocketObj(roomid, eventName, eventMethodName));
      // });

      socket.on('join room', function(id) {
        socket.join(id);
      });

      socket.on('chat message', function(msg) {
        var _msgObj = JSON.parse(msg);
        app.io.to(_msgObj.roomId).emit('chat message', msg);
      });

      socket.on('add new team info', function(msg) {
        app.io.emit('add new team info', msg);
      });
    });
  }
});
