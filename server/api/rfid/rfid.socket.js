'use strict';
var User = require('../user/user.model');

exports.register = function(socket, serialPort) {
  serialPort.on('data', function(data) {
    console.log('RFID data received');
    socket.emit('rfid:save', data);
  });
}


