'use strict';

angular.module('devicelibApp')
  .controller('DevicesCtrl', function ($scope, Device, $log, socket) {
    $log.debug('devices');
    $scope.alerts = [];
    $scope.devices = Device.query();
    socket.syncUpdates('device', $scope.devices);

    $scope.removeDevice = function(device) {
      Device.remove({id: device._id});
      $scope.addAlert('success', 'Device deleted');
    };

    $scope.addAlert = function(type, msg) {
      $scope.alerts.push({type: type, msg: msg});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.clientFieldChanged = function(model) {
      new Device(model).$update();
    };

    $scope.$on('$destroy', function () {
     socket.unsyncUpdates('device');
    });
  });
