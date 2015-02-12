var Player = require('player');
var Q = require('q');

function play(file) {
  var defer = Q.defer();
  var player = new Player(__dirname + '/' + file);
  player.play(function(err, player){
    if (err) {
      console.error(err);
      defer.reject(err);
    }
    defer.resolve();
  });
  return defer.promise;
}


module.exports.deviceAttachedKnown = function() {
  return play('sound/ding.mp3');
}

module.exports.deviceAttachedUnknown = function() {
  return play('sound/tink.mp3');
}

module.exports.deviceDeattachedWithoutTag = function() {
  return play('sound/gunshot.mp3');
}

module.exports.deviceDeattachedWithTag = function() {
  return play('sound/ding.mp3');
}

module.exports.rfidKnownSwiped = function() {
  return play('sound/ding.mp3')
}

module.exports.rfidUnknownSwiped = function() {
  return play('sound/tink.mp3')
}