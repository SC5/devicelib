'use strict';
var crypto = require('crypto');
var salt = require('../../config/environment').salt;
var fs = require('fs');
var device = "/dev/ttySAC0";
var SerialPort = require("serialport").SerialPort
var serialPort;
var serialPortOptions = {
  baudrate: 9600,
  flowControl: false
};

var EventEmitter =  require('events').EventEmitter;

var emitter = new EventEmitter();

var exists = fs.existsSync(device);
if (exists) {
  serialPort = new SerialPort(device, serialPortOptions);
  serialPort.on('open', function() {
    console.log("Serial port device " + device + " okay");
    serialPort.on('data', function(data) {
      var strData;
      console.log('RFID data received');
      if (data.toString) {
        strData = data.toString();
      } else {
        strData = ""+data;
      }
      emitter.emit('data', genHash(strData));
    })
  })
} else { // fake rfid, just for development purposes
  console.error('No serial port device detected at' + device);
}

function genHash(str) {
  var shasum = crypto.createHash('sha256');
  shasum.update(salt + str);
  return shasum.digest('hex');
}

module.exports = emitter;
