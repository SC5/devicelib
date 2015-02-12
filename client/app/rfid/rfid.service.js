'use strict';

angular.module('devicelibApp')
  .service('rfid', ['$q', 'User', '$log', function ($q, User, $log) {
    return {
      user: {},
      getLoggedInUser: function() {
        var that = this;
        var defer = $q.defer();
        this.user = {};
        var users = User.query(function() {
          for(var i = 0; i < users.length; ++i) {
            if (users[i].active) {
              $log.debug('user ' + users[i].name + ' active');
              that.user = users[i];
              break;
            }
          }
          defer.resolve(that.user);
        });
        return defer.promise;
      },
      logout: function() {
        var defer = $q.defer();
        var that = this;
        if (this.user._id) {
          var user = new User(this.user);
          user.active = false;
          user.$update(function() {
            that.user = {};
            defer.resolve();
          });
        } else {
          defer.reject('user not logged in')
        }
        return defer.promise;
      }
    };

  }]);
