'use strict';

angular.module('devicelibApp')
  .controller('LogoutCtrl', function ($scope, socket, $timeout, $location, rfid) {
    var timeout;
    socket.syncUpdates('user', [], function(eventName, user) {
      if (user.active) {
        $location.path('/loan');
        $timeout.cancel(timeout);
      }
    });

    rfid.logout().then(function() {
      timeout = $timeout(function() {
        $location.path('/');
      }, 5000);
    }, function() {
      $location.path('/');
    });

    $scope.$on('$destroy', function() {
      $timeout.cancel(timeout);
      socket.unsyncUpdates('user');
    });
  });
