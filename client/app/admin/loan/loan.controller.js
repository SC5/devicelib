'use strict';

angular.module('devicelibApp')
  .controller('LoanCtrl', function ($scope, rfid, Device, socket, $location, $interval, $resource, $log, User) {
    if (Object.keys(rfid.user).length === 0) {
      $log.debug('No user tag associated');
      $location.path('/');
      return;
    }
    $scope.devices = Device.query();
    socket.syncUpdates('device', $scope.devices);

    $scope.user = rfid.user || {};
    $scope.logoutInSecs = 12;
    var counter = $interval(function() {
      $scope.logoutInSecs = $scope.logoutInSecs-1;
      if ($scope.logoutInSecs === 0) {
        $interval.cancel(counter);
        var user = User.get({id:rfid.user._id}, function() {
          user.active = false;
          user.$update(function() {
            rfid.user = {};
            $location.path('/');
          });
        });
      }
    }, 1000);
  });
