'use strict';

angular.module('devicelibApp')
  .service('rfid', ['$q', 'User', function ($q, User) {
    return {
      user: {},
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
