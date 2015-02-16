'use strict';

angular.module('devicelibApp')
  .controller('FooterCtrl', function ($scope, socket, $location, Device, Modal, rfid, Util) {
    $scope.isApp = !Util.isAdmin($location);
    $scope.user = {};
    $scope.devices = Device.query();

    // Watch if current logged in/logged out user changes
    $scope.$watch(
      function(scope) {
        return rfid.user;
      },
      function(newVal, oldVal, scope) {
        scope.user = newVal;
      }
    );

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.$on('$locationChangeSuccess', function() {
      $scope.isApp = !Util.isAdmin($location);
      bindSyncUpdates();
    });
    bindSyncUpdates();

    function bindSyncUpdates() {
      socket.unsyncUpdates('user');
      socket.unsyncUpdates('device');

      // Mark user as logged in/logged out in every view
      socket.syncUpdates('user', [], function(eventName, user) {
        $scope.user = user;
      });

      // Open modal dialog "New Device" in every view
      socket.syncUpdates('device', $scope.devices, function(event, device) {
        if (device.status === 'available' && !!!device.label) {
          $scope.displayModal = Modal.confirm.newDevice(device, function(data) {
            var d = new Device(device);
            d.name = data.name;
            d.label = data.label;
            d.$update();
          });
          $scope.displayModal();
        }
      });
    }
  });
