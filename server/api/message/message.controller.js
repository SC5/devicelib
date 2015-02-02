'use strict';

var _ = require('lodash');
var Message = require('./message.model');

// Get list of messages
exports.registered = function(user) {
  Message.emit('message', {title: "Tag registered", body: user.name, type: "success"});
};

exports.unregistered = function() {
  Message.emit('message', {title: "Unregistered tag", body: "Register your tag to your name", type: "danger"});
};

exports.deviceRemovedWithoutTag = function() {
  Message.emit('message', {title: "Device removed without tag", body: "Register your tag to your name", type: "danger"});
};
