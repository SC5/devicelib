'use strict';
var crypto = require('crypto');
var salt = "sc5Devic3S4lT";

exports.register = function(socket, serialPort) {
  serialPort.on('data', function(data) {
    console.log('RFID data received');
    socket.emit('rfid:save', genHash(data));
  });
}
function genHash(str) {
  var shasum = crypto.createHash('sha256');
  shasum.update(salt + str);
  return shasum.digest('hex');
}

