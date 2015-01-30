'use strict';

angular.module('devicelibApp')
  .controller('LoanCtrl', function ($scope, rfid, $http, socket, $location, $interval) {
    if (Object.keys(rfid.user).length === 0) {
      $location.path('/');
      return;
    }
    $http.get('/api/devices?active=true').success(function(devices) {
      $scope.devices = devices;
      socket.syncUpdates('device', $scope.devices);
    });
    $scope.user = rfid.user || {};
    $scope.logoutInSecs = 120;
    var counter = $interval(function() {
      $scope.logoutInSecs = $scope.logoutInSecs-1;
      if ($scope.logoutInSecs === 0) {
        $interval.cancel(counter);
        rfid.user = {};
        $location.path('/');
      }
    }, 1000);
  });
