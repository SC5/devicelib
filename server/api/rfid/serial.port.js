'use strict';
var crypto = require('crypto');
var salt = "sc5Devic3S4lT"; // TODO change and move to config
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
} else { // fake rfid, just for development purposes
  console.log("Serial port device does not exists, using timed interval rfid read events")
  serialPort = new EventEmitter();
  setTimeout(function() {
    serialPort.emit('open');
    setInterval(function() {
      var data = "0123456780" + random(100, 999);
      data = "41e2d8ab19b78ebfca8b235df08e6f5b98b8afb7652bb7cc19477e264d1deda1";
      //data = genHash(data);
      console.log("emit", data);
      serialPort.emit('data', data);
    }, 5000);
  }, 3000);

}

function random (low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

function genHash(str) {
  var shasum = crypto.createHash('sha256');
  shasum.update(salt + str);
  return shasum.digest('hex');
}




module.exports = serialPort;
