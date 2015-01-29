/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Loan = require('./loan.model');

exports.register = function(socket) {
  Loan.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Loan.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('loan:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('loan:remove', doc);
}