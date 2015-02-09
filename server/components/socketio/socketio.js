/**
 * Socket.io configuration
 */

'use strict';

var config = require('./../../config/environment/index');
var messageController = require('../../api/message/message.controller.js');
var User = require('../../api/user/user.model.js');

// When the user disconnects.. perform this
function onDisconnect(socket) {

}

// When the user connects.. perform this
function onConnect(socket, serialPort) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../../api/message/message.socket.js').register(socket);
  require('../../api/rfid/rfid.socket.js').register(socket, serialPort);
  require('../../api/loan/loan.socket.js').register(socket);
  require('../../api/user/user.socket.js').register(socket);
  require('../../api/device/device.socket.js').register(socket);
}

module.exports = function (socketio, serialPort) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  // RFID serial handler
  serialPort.on('data', function(data) {
    // broadcast to all
    socketio.sockets.emit('rfid:save', data);

    var query  = User.where({rfid: data});
    query.findOne(function(err, user) {
      if (err) {
        console.log("error occurred while querying by rfid");
      }
      if (user) {
        console.log("Found user", user);
        messageController.registered(user);
        user.active = true;
        user.save();
      } else {
        messageController.unregistered();
      }
    });
  });

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    // Call onConnect.
    onConnect(socket, serialPort);
    console.info('[%s] CONNECTED', socket.address);
  });
};
