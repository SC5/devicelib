'use strict';

var _ = require('lodash');
var Device = require('./device.model');
var User = require('../user/user.model');
var EventEmitter = require('events').EventEmitter;
var messages = require('../message/message.controller');

// Get list of devices
exports.index = function(req, res) {
  var queryParams = ['active'];
  var query = {};
  for (var i = 0; i < queryParams; ++i) {
    if (req.params[queryParams[i]]) {
      query[queryParams[i]] = req.params[queryParams[i]];
    }
  }
  console.log("query", req.params);
  console.log("finding with", query);
  Device.find(query, function (err, devices) {
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

// udev is linux only stuff
var udev;
if (process.platform === 'linux') {
  udev = require('udev');
} else { // so for dev purposes this fakes some devices for other platforms, no 'add' and 'remove' events :/
  udev = {
    list: function() {
      return require('./dev.fixture');
    },
    monitor: function() {
      var emitter = new EventEmitter();
      var adds = true;
        setInterval(function(){
          //emitter.emit(adds?'add':'remove', udev.list()[0]);
          adds = !adds;
        }, 5000);
      return emitter;
    }
  }

}
var devices = udev.list();
var monitor = udev.monitor();

Device.update({active: false}, function(err, d) {
  console.log("deactivated " + d.length + " devices");
  findDevices(devices);
});


function findDevices(devices) {
  var len = 0;
  for (var i = 0; i < devices.length; ++i) {
    var device = devices[i];
    if (isMobileDevice(device)) {
      len = len + 1;
      console.log(
        device.ID_MODEL_FROM_DATABASE,
        device.ID_MODEL,
        device.ID_SERIAL_SHORT
      );
      var query = {serialNumber: device.ID_SERIAL_SHORT};
      device.lastSeen = new Date();
      device.active = true;
      Device.findOneAndUpdate(query, createFromUDEVObject(device), {upsert: true}, function(err) {
        if (err) {
          console.log("Error in find devices", err);
        }
      });
    }
  }
  console.log(len + " mobile devices detected");
}

function isMobileDevice(d) {
  return d.DEVTYPE === 'usb_device' &&
    /(iphone|android|sailfish|nokia|ipad)/i.test(d.ID_SERIAL);
}

var loanController = require('../loan/loan.controller');

monitor.on('add', function(device) {
  if (isMobileDevice(device) === false) {
    return;
  }
  var query = {serialNumber: device.ID_SERIAL_SHORT};
  Device.findOne(query, function(err, doc) {
    if (doc === null) {
      Device.create(createFromUDEVObject(device), function (err) {
        if (err) {
          console.log("error saving doc", doc)
        }
      });
    } else {
      console.log("device attached");
      loanController.loanEnd(doc);

      doc.loanedBy = null;
      doc.active = true;
      updateDevice(doc);
    }
  })
});



monitor.on('remove', function(device) {
  if (isMobileDevice(device) === false) {
    return;
  }
  var query = {serialNumber: device.ID_SERIAL_SHORT};
  Device.findOne(query, function(err, doc) {
    doc.active = false;
    console.log("device deattached")
    setLoan(function(user) {
      if (user) {
        doc.loanedBy = user.name;
        loanController.loanStart(doc);
      } else {
        messages.deviceRemovedWithoutTag();
      }
      updateDevice(doc);
    });
  })
});

function updateDevice(doc) {
  if (doc) {
    doc.lastSeen = new Date();
    doc.save()
  }
}

function setLoan(cb) {
  User.findOne({active:true}, function(err, user) {
    if (err) {
      console.log("error while querying users", err);
      return
    }
    cb(user)
  })
}

function createFromUDEVObject(dev) {
  return {
    "name": dev.ID_MODEL,
    "serialNumber" : dev.ID_SERIAL_SHORT,
    "vendorId" : dev.ID_VENDOR || dev.ID_VENDOR_ID,
    "deviceName" : dev.ID_MODEL,
    "manufacturer" : dev.VENDOR_FROM_DATABASE || dev.ID_VENDOR || dev.ID_VENDOR_ID,
    "lastSeen" : new Date(),
    "active" : true
  };
}