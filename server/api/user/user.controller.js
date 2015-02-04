'use strict';

var crypt = require('crypto');
var _ = require('lodash');
var User = require('./user.model');
var fs = require('fs');
var request = require('request');
    

// Helper function to download Garavatar images
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

// Get Gravatar hash
var grav_hash = function(req_body, callback) {
  if(!req_body.gravatar_img) {
    req_body.gravatar_img = {
      data: '',
      contentType: 'image/jpeg'
    };
  }
  if(req_body.email) {
    var hash = crypt.createHash('md5').update(req_body.email).digest('hex');
    download('http://www.gravatar.com/avatar/' + hash, hash, function(){
      var img = fs.readFileSync(hash);
      req_body.gravatar_img = "data:image/jpeg;base64," + img.toString('base64');
      console.log(img.toString('base64'));
      fs.unlinkSync(hash);
      callback(req_body);
    });
  }
  else {
    download('http://www.gravatar.com/avatar/default', "gravatar.tmp", function(){
      var img = fs.readFileSync("gravatar.tmp");
      req_body.gravatar_img = "data:image/jpeg;base64," + img.toString('base64');
      fs.unlinkSync("gravatar.tmp");
      callback(req_body);
    });
  }
}

// Get list of users
exports.index = function(req, res) {
  User.find(function (err, users) {
    if(err) { return handleError(res, err); }
    return res.json(200, users);
  });
};

// Get a single user
exports.show = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    return res.json(user);
  });
};

// Creates a new user in the DB.
exports.create = function(req, res) {
  grav_hash(req.body, function(resp) {
    User.create(resp, function(err, user) {
      console.log(user);
      if(err) { return handleError(res, err); }
      return res.json(201, user);
    })
  })
};


// Updates an existing user in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  User.findById(req.params.id, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    grav_hash(req.body, function(resp) {
      var updated = _.merge(user, resp);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(200, user);
      });
    });
  });
};

// Deletes a user from the DB.
exports.destroy = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    user.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}