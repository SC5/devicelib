'use strict';

angular.module('devicelibApp')
  .controller('FooterCtrl', function ($scope, $location, Util) {
    $scope.isApp = !Util.isAdmin($location);

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.$on('$locationChangeSuccess', function() {
      $scope.isApp = !Util.isAdmin($location);
    });
  });
