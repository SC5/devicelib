'use strict';

angular.module('devicelibApp')
  .controller('MainCtrl', function ($scope, $http, socket, $timeout, rfid, $location, $log, Device) {
    
    $scope.alerts = [];
    $scope.user = null;
    $scope.addAlert = function(type, msg) {
      $scope.alerts.push({type: type, msg: msg});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.devices = Device.query();
    socket.syncUpdates('device', $scope.devices);

    socket.syncUpdates('message', [], function(event, item) {
      $log.debug('Message received', item);
      $scope.addAlert(item.type, item.title + ': ' + item.body);
      $timeout(function() {
        $scope.closeAlert(0);
      }, 5000);
    });

    socket.syncUpdates('user', [], function(event, user) {
      if (user.active) {
        $scope.user = {name: user.name};
        $scope.showLoans = true;
        rfid.user = user;
        $location.path('/loan');
      }
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('device');
      socket.unsyncUpdates('message');
    });

    $scope.clientFieldChanged = function(model) {
      $log.debug(model);
      var device = Device.get({id:model._id}, function() {
        device = angular.extend(device, model);
        device.$update();
      });
    };
  });
