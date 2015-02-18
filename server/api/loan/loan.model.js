'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LoanSchema = new Schema({
  deviceId: String,
  deviceLabel: String,
  deviceName: String,
  userName: String,
  start: Date,
  end: Date,
  created: Date,
  updated: Date
});

LoanSchema.pre('save', function(next){
  var now = new Date();
  this.updated = now;
  if (!this.created) {
    this.created = now;
  }
  next();
});

module.exports = mongoose.model('Loan', LoanSchema);