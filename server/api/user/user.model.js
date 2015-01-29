'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  rfid: String,
  active: Boolean
});

module.exports = mongoose.model('User', UserSchema);