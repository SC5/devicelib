'use strict';

var _ = require('lodash');
var Device = require('./device.model');

// Get list of devices
exports.index = function(req, res) {
  Device.find(function (err, devices) {
    if(err) { return handleError(res, err); }
    return res.json(200, devices);
  });
};

// Get a single device
exports.show = function(req, res) {
  Device.findById(req.params.id, function (err, device) {
    if(err) { return handleError(res, err); }
    if(!device) { return res.send(404); }
    return res.json(device);
  });
};

// Creates a new device in the DB.
exports.create = function(req, res) {
  Device.create(req.body, function(err, device) {
    if(err) { return handleError(res, err); }
    return res.json(201, device);
  });
};

// Updates an existing device in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Device.findById(req.params.id, function (err, device) {
    if (err) { return handleError(res, err); }
    if(!device) { return res.send(404); }
    var updated = _.merge(device, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, device);
    });
  });
};

// Deletes a device from the DB.
exports.destroy = function(req, res) {
  Device.findById(req.params.id, function (err, device) {
    if(err) { return handleError(res, err); }
    if(!device) { return res.send(404); }
    device.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

var monitor = require('usb-detection');

monitor.find(function(error, devices) {
  Device.update({active: false}, function(err, d) {
    console.log("deactivated " + d.length + " devices");
    findDevices(devices);
  });
});

function findDevices(devices) {
  for (var i = 0; i < devices.length; ++i) {
    var device = devices[i];
    if (isMobileDevice(device)) {
      console.log("detected mobile device", device.deviceName, device.serialNumber);
      var query = {serialNumber: device.serialNumber};
      device.lastSeen = new Date();
      device.active = true;
      Device.findOneAndUpdate(query, device, {upsert: true}, function(err, d) {
        console.log(err, d);
      });
    }
  }
}

function isMobileDevice(d) {
  return /(iphone|android|sailfish|nokia|ipad)/i.test(d.deviceName);
}

monitor.on('add', function(device) {
  if (isMobileDevice(device) === false) {
    return;
  }
  var query = {serialNumber: device.serialNumber};
  Device.findOne(query, function(err, doc) {
    if (doc === null) {
      Device.create(device, function (err) {
        if (err) {
          console.log("error saving doc", doc)
        }
      });
    } else {
      doc.active = true;
      updateDevice(doc);
    }
  })
});

monitor.on('remove', function(device) {
  if (isMobileDevice(device) === false) {
    return;
  }
  var query = {serialNumber: device.serialNumber};
  Device.findOne(query, function(err, doc) {
    doc.active = false;
    updateDevice(doc);
  })
});
function updateDevice(doc) {
  if (doc) {
    doc.lastSeen = new Date();
    doc.save()
  }
}
