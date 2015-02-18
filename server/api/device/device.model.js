'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeviceSchema = new Schema({
  name: String,
  label: String,
  status: String, /* 'available', 'basket', 'borrowed' */
  loanedBy: String,
  info: String,
  lastSeen: Date,
  locationId: String,
  vendorId: String,
  productId: String,
  manufacturer: String,
  serialNumber: String,
  deviceAddress: String,
  created: Date,
  updated: Date
});

DeviceSchema.pre('save', function(next){
  var now = new Date();
  this.updated = now;
  if (!this.created) {
    this.created = now;
  }
  next();
});

module.exports = mongoose.model('Device', DeviceSchema);