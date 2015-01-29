/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var message = require('./message.model');

exports.register = function(socket) {
  message.on('message', function(message) {
    socket.emit("message:save", message)
  });
}

