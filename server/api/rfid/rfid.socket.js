'use strict';

exports.register = function(socket, serialPort) {
  serialPort.on('data', function(data) {
    socket.emit('rfid:save', data);
  });
}


