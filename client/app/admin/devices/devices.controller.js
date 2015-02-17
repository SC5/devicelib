'use strict';

angular.module('devicelibApp')
  .controller('DevicesCtrl', function ($scope, Device, $log, socket, User) {
    $log.debug('devices');
    $scope.alerts = [];
    $scope.devices = Device.query(function() {
      getGravatars();
    });
    socket.syncUpdates('device', $scope.devices, getGravatars);

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

    function getGravatars() {
      $scope.devices.forEach(function(device) {
        if (device.loanedBy && !device.loanedByImage) {
          User.query(function(u) {
            device.loanedByImage = u[0].gravatar_img;
          });
        } else {
          if (device.status !== 'available') {
            device.loanedBy = 'Device Pirate';
            device.loanedByImage = '/assets/images/pirate.png';
          }
        }
      });
    }
  });
