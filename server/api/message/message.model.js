'use strict';
var EventEmitter = require('events').EventEmitter;
var msg = new EventEmitter();
console.log("new instance msg emitter");
module.exports = msg;

msg.on('message', function(msg) {
  console.log("got a message", msg)
});
