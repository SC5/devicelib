'use strict';

var _ = require('lodash');
var Loan = require('./loan.model');

// Get list of loans
exports.index = function(req, res) {
  Loan.find(function (err, loans) {
    if(err) { return handleError(res, err); }
    return res.json(200, loans);
  });
};

// Get a single loan
exports.show = function(req, res) {
  Loan.findById(req.params.id, function (err, loan) {
    if(err) { return handleError(res, err); }
    if(!loan) { return res.send(404); }
    return res.json(loan);
  });
};

// Creates a new loan in the DB.
exports.create = function(req, res) {
  Loan.create(req.body, function(err, loan) {
    if(err) { return handleError(res, err); }
    return res.json(201, loan);
  });
};

// Updates an existing loan in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Loan.findById(req.params.id, function (err, loan) {
    if (err) { return handleError(res, err); }
    if(!loan) { return res.send(404); }
    var updated = _.merge(loan, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, loan);
    });
  });
};

// Deletes a loan from the DB.
exports.destroy = function(req, res) {
  Loan.findById(req.params.id, function (err, loan) {
    if(err) { return handleError(res, err); }
    if(!loan) { return res.send(404); }
    loan.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.loanStart = function(device) {
  var query = {
    deviceId: device._id,
    deviceLabel: device.label,
    deviceName: device.name,
    userName: device.loanedBy,
    start: new Date()
  };
  Loan.create(query);
}

exports.loanEnd = function(device) {
  console.log("ending loan", device);
  Loan.findOneAndUpdate({deviceId: device._id, end: null}, {end: new Date()}, function(err, doc){
    if (err) {
      console.log("something wrong with loanEnd", err);
    }
    console.log("ended loan", doc)
  });
}
function handleError(res, err) {
  return res.send(500, err);
}