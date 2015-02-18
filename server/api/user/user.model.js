'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: String,
  rfid: String,
  gravatar_img: String,
  active: Boolean,
  nonregistered: {type: Boolean, default: true},
  created: Date,
  updated: Date
});

UserSchema.pre('save', function(next){
  var now = new Date();
  this.updated = now;
  if (!this.created) {
    this.created = now;
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);