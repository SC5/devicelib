'use strict';

var Q = require('q');
var _ = require('lodash');
var Loan = require('./loan.model');

// Get list of loans
exports.index = function(req, res) {
  var sortFields = ['username', 'deviceName', 'deviceLabel', 'start', 'end'];
  var sort = {'end': 'desc'};
  var limit = req.query.limit ? parseInt(req.query.limit) : 20;
  var skip = req.query.skip ? parseInt(req.query.skip) : 0;
  if (req.query.sortField && sortFields.indexOf(req.query.sortField) !== -1) {
    var sortField = req.query.sortField.toLowerCase();
    sort[sortField] = req.query.sortType.toLowerCase() === 'desc' ? 'desc' : 'asc';
  }

  countModels(Loan).then(function(totalCount) {
    Loan.find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec(function (err, loans) {
        if(err) { return handleError(res, err); }
        return res.json(200, addMeta(loans, {totalItems: totalCount}));
      });
  }, function(err) {
    console.error(err);
  });
};

function addMeta(res, meta) {
  return {
    meta: meta,
    results: res
  }
}

function countModels(model) {
  var deferred = Q.defer();
  model.find().exec(function(err, items) {
    if (err) {
      deferred.reject(new Error(err));
    } else {
      deferred.resolve(items.length);
    }
  });
  return deferred.promise;
}

exports.count = function(req, res) {
  Loan.find().exec(function(err, loans) {
    return res.json(200, {count: loans.length});
  });
}

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