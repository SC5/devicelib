var monitor = require('usb-detection');
var EventEmitter = require('events').EventEmitter;
var emitter = new EventEmitter();
var utils = require('./utils');


emitter.findDevices = function(cb) {
  monitor.find(function(err, devices) {
    var foundDevices = [];
    for (var i = 0; i < devices.length; ++i) {
      if (utils.isMobileDevice(devices[i])) {
        foundDevices.push(createDeviceObject(devices[i]));
      }
    }
    cb(foundDevices);
  });
};

monitor.on('add', function(device) {
  if (utils.isMobileDevice(device)) {
    emitter.emit('add', createDeviceObject(device));
  }
});

monitor.on('remove', function(device) {
  if (utils.isMobileDevice(device)) {
    emitter.emit('remove', createDeviceObject(device));
  }
});

function createDeviceObject(device) {
  try {
    return {
      "name": device.deviceName,
      "deviceName": device.deviceName,
      "serialNumber" : device.serialNumber,
      "manufacturer" : device.manufacturer,
      "lastSeen" : new Date(),
      "active" : true
    }
  } catch (e) {
    console.error(e.stack);
  }
}

module.exports = emitter;