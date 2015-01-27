'use strict';

angular.module('devicelibApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.devices = [];

    $http.get('/api/devices').success(function(devices) {
      $scope.devices = devices;
      socket.syncUpdates('device', $scope.devices);
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('device');
    });
  });
