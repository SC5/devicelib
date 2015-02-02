var Device = require('./../../api/device/device.model.js');
var User = require('../../api/user/user.model.js');
var messages = require('../../api/message/message.controller.js');
var loanController = require('../../api/loan/loan.controller.js');

var usbReader;
// udev is linux only stuff

if (process.platform === 'linux') {
  usbReader = require('./udev');
} else {
  usbReader = require('./usb.detection');
}


function findDevicesHandler(devices) {
  for (var i = 0; i < devices.length; ++i) {
    var device = devices[i];
    var query = {serialNumber: device.serialNumber};
    device.lastSeen = new Date();
    device.active = true;
    Device.findOneAndUpdate(query, device, {upsert: true}, function(err) {
      if (err) {
        console.log("Error in find devices", err);
      }
    });

  }
  console.log(devices.length + " mobile devices detected");
}

Device.update({active: false}, function(err, d) {
  if (d) {
    console.log("deactivated " + d.length + " devices");
  }
  usbReader.findDevices(findDevicesHandler);
});


usbReader.on('add', function(device) {
  console.log("USB ATTACHED", device);
  var query = {serialNumber: device.serialNumber};
  console.log("querying", device);
  Device.findOne(query, function(err, doc) {
    if (doc === null) {
      console.log("device not found, saving");
      Device.create(device, function (err) {
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

usbReader.on('remove', function(device) {
  console.log("USB DEATTACHED", device);
  var query = {serialNumber: device.serialNumber};
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

