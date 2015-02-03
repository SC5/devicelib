'use strict';

exports.register = function(socket, serialPort) {
  serialPort.on('data', function(data) {
    socket.emit('rfid:save', data);
  });
  socket.on('development:rfid', function() {
    console.log("Generating RFID event '1234567890'");
    serialPort.emit('data', '1234567890');
  });
}


