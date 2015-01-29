'use strict';

angular.module('devicelibApp')
  .controller('MainCtrl', function ($scope, $http, socket, $timeout) {
    $scope.devices = [];
    $scope.alerts = [];
    $scope.user = null;
    $scope.addAlert = function(type, msg) {
      $scope.alerts.push({type: type, msg: msg});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $http.get('/api/devices').success(function(devices) {
      $scope.devices = devices;
      socket.syncUpdates('device', $scope.devices);
    });
    socket.syncUpdates('message', [], function(event, item) {
      console.log("Message received", item);
      $scope.addAlert(item.type, item.title + ': ' + item.body);
      $timeout(function() {
        $scope.closeAlert(0);
      }, 5000);
    });

    socket.syncUpdates('user', [], function(event, user) {
      if (user.active) {
        $scope.user = {name: user.name};
        $scope.showLoans = true;
      }
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('device');
    });
  });
