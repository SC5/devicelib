'use strict';
var User = require('../user/user.model');


exports.register = function(socket, serialPort) {
  serialPort.on('data', function(data) {
    socket.emit('rfid:save', data);
  });
}


