'use strict';

angular.module('devicelibApp')
  .controller('LoanCtrl', function ($scope, rfid, Device, socket, $location, $interval, $resource, $log) {
    rfid.getLoggedInUser().then(function(user) {
      if (Object.keys(user).length === 0) {
        $log.debug('No user tag associated');
        $location.path('/');
        return;
      } else {
        $scope.user = user;
      }
    });

    $scope.devices = Device.query();
    socket.syncUpdates('device', $scope.devices);
    socket.syncUpdates('user', [], function(e, user) {
      if (user._id === $scope.user._id && user.active === false) {
        $scope.done()
      }
    });

    $scope.done = function() {
      $location.path('/logout');
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('device');
      socket.unsyncUpdates('user');
    });

  }).filter('available', function() {
    return function(devices) {
      if (!!devices === false) {
        return 0;
      }
      function f(d) {
        return d.status === 'available';
      }
      var filtered = [];
      for (var i = 0; i < devices.length; ++i) {
        if (f(devices[i])) {
          filtered.push(devices[i]);
        }
      }
      return filtered.length;
    };
  });
