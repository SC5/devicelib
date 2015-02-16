'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: String,
  rfid: String,
  gravatar_img: String,
  active: Boolean,
  nonregistered: {type: Boolean, default: true}
});

module.exports = mongoose.model('User', UserSchema);