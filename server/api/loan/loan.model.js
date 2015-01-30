'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LoanSchema = new Schema({
  deviceId: String,
  deviceName: String,
  userName: String,
  start: Date,
  end: Date
});

module.exports = mongoose.model('Loan', LoanSchema);