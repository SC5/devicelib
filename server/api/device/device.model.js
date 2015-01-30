'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeviceSchema = new Schema({
  name: String,
  loanedBy: String,
  info: String,
  active: Boolean,
  lastSeen: Date,
  locationId: String,
  vendorId: String,
  productId: String,
  deviceName: String,
  manufacturer: String,
  serialNumber: String,
  deviceAddress: String
});

module.exports = mongoose.model('Device', DeviceSchema);