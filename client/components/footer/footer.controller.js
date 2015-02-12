'use strict';

angular.module('devicelibApp')
  .controller('FooterCtrl', function ($scope, $location, rfid, Util) {
    $scope.isApp = !Util.isAdmin($location);
    $scope.user = {};

    $scope.$watch(
      function(scope) {
        return rfid.user;
      },
      function(newVal, oldVal, scope) {
        scope.user = newVal;
      });

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.$on('$locationChangeSuccess', function() {
      $scope.isApp = !Util.isAdmin($location);
    });
  });
