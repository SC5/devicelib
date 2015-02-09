'use strict';
var EventEmitter = require('events').EventEmitter;
var msg = new EventEmitter();
msg.setMaxListeners(4096);
console.log("new instance msg emitter");
module.exports = msg;

