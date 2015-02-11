var Device = require('./../../api/device/device.model.js');
var User = require('../../api/user/user.model.js');
var messages = require('../../api/message/message.controller.js');
var loanController = require('../../api/loan/loan.controller.js');

var usbReader;

if (process.platform === 'linux') {
  usbReader = require('./udev');
} else {
  usbReader = require('./usb.detection');
}

usbReader.findDevices(findDevicesHandler);
function findDevicesHandler(devices) {
  for (var i = 0; i < devices.length; ++i) {
    var device = devices[i];
    var query = {serialNumber: device.serialNumber};
    updateFoundDevice(query);
  }
  console.log(devices.length + " mobile devices detected");
}

function updateFoundDevice(query) {
  Device.findOne(query, function(err, dev) {
    if (err) {
      console.log("Error in find devices", err);
    }
    if (dev.loanedBy) {
      loanController.loanEnd(dev);
    }
    dev.lastSeen = new Date();
    dev.status = 'available'; // TODO const vars better define somewhere
    dev.loanedBy = '';
    dev.save();
  });
}



usbReader.on('add', function(device) {
  console.log("USB ATTACHED", device);
  var query = {serialNumber: device.serialNumber};
  console.log("querying", device);
  Device.findOne(query, function(err, doc) {
    if (doc === null) {
      console.log("attached device not found, adding it to database");
      device.status = 'available'; // TODO const vars better define somewhere
      var deviceModel = new Device(device);
      deviceModel.save(device, function (err) {
        if (err) {
          console.log("error saving doc", doc)
        }
      });
    } else {
      console.log("device attached");
      loanController.loanEnd(doc);
      doc.loanedBy = null;
      doc.status = 'available'; // TODO const vars better define somewhere
      updateDevice(doc);
    }
  })
});

usbReader.on('remove', function(device) {
  console.log("USB DISCONNECTED", device);
  var query = {serialNumber: device.serialNumber};
  Device.findOne(query, function(err, doc) {
    if (doc === null) {
      console.error('disconnected device was not found from DB');
      return;
    }
    setLoan(function(user) {
      if (user) {
        doc.loanedBy = user.name;
        loanController.loanStart(doc);
        doc.status = 'borrowed'; // TODO const vars better define somewhere
      } else {
        messages.deviceRemovedWithoutTag();
        doc.status = 'basket'; // TODO const vars better define somewhere
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

