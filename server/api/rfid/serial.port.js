'use strict';
var fs = require('fs');
var device = "/dev/ttySAC0";
var SerialPort = require("serialport").SerialPort
var serialPort;
var serialPortOptions = {
  baudrate: 9600,
  flowControl: false
};
var EventEmitter =  require('events').EventEmitter;

var exists = fs.existsSync(device);
if (exists) {
  serialPort = new SerialPort(device, serialPortOptions);
} else {
  console.log("Serial port device does not exists, using timed interval rfid read events")
  serialPort = new EventEmitter();
  setTimeout(function() {
    serialPort.emit('open');
    setInterval(function() {
      var data = "0123456780" + random(100, 999);
      serialPort.emit('data', data);
    }, 5000);
  }, 3000);

}

function random (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}




module.exports = serialPort;
