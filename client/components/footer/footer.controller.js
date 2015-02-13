'use strict';

angular.module('devicelibApp')
  .controller('FooterCtrl', function ($scope, socket, $location, rfid, Util) {
    $scope.isApp = !Util.isAdmin($location);
    $scope.user = {};

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
      bindUserListener();
    });
    bindUserListener();

    function bindUserListener() {
      socket.unsyncUpdates('user');
      socket.syncUpdates('user', [], function(eventName, user) {
        $scope.user = user;
      });
    }
  });
