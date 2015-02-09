'use strict';

exports.register = function(socket, serialPort) {
  socket.on('development:rfid', function() {
    console.log("Generating RFID event '1234567890'");
    serialPort.emit('data', '1234567890');
  });
}


