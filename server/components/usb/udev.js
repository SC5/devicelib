var EventEmitter = require('events').EventEmitter;


var udev = require('udev');
var devices = udev.list();
var monitor = udev.monitor();
var emitter = new EventEmitter();
var utils = require('./utils');



emitter.findDevices = function(cb) {
  var foundDevices = [];
  for (var i = 0; i < devices.length; ++i) {
    var device = devices[i];
    if (utils.isMobileDevice(device)) {
      console.log(
        device.ID_MODEL_FROM_DATABASE,
        device.ID_MODEL,
        device.ID_SERIAL_SHORT
      );
      foundDevices.push(createFromUDEVObject(device));
    }
  }
  cb(foundDevices);
}

monitor.on('add', function(device) {
  if (utils.isMobileDevice(device) === false) {
    return;
  }
  emitter.emit('add', createFromUDEVObject(device));
});

monitor.on('remove', function(device) {
  if (utils.isMobileDevice(device) === false) {
    return;
  }
  emitter.emit('remove', createFromUDEVObject(device));
});


function createFromUDEVObject(device) {
  return {
    "name": device.ID_MODEL,
    "serialNumber" : device.ID_SERIAL_SHORT,
    "vendorId" : device.ID_VENDOR || device.ID_VENDOR_ID,
    "deviceName" : device.ID_MODEL,
    "manufacturer" : device.VENDOR_FROM_DATABASE || device.ID_VENDOR || device.ID_VENDOR_ID,
    "lastSeen" : new Date(),
    "active" : true
  };
}


module.exports = emitter;