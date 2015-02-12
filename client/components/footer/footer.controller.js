'use strict';

angular.module('devicelibApp')
  .controller('FooterCtrl', function ($scope, $location, rfid, Util) {
    $scope.isApp = !Util.isAdmin($location);
    $scope.user = {};

    // Remove the user name text before the rfid model updates
    $scope.$on('$locationChangeSuccess', function(scope, path) {
      if (path.split('/').pop() === 'logout') {
        $scope.user = {};
      } else {
        $scope.user = rfid.user || {};
      }
    });

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.$on('$locationChangeSuccess', function() {
      $scope.isApp = !Util.isAdmin($location);
    });
  });
