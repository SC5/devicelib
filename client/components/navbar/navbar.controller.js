'use strict';

angular.module('devicelibApp')
  .controller('NavbarCtrl', function ($scope, $location, Util) {
    $scope.isAdmin = Util.isAdmin($location);
    $scope.menu = [{
      'title': 'Devices',
      'link': '/admin/devices'
    }, {
      'title': 'Users',
      'link': '/admin/users'
    }, {
      'title': 'History',
      'link': '/admin/history'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.$on('$locationChangeSuccess', function() {
      $scope.isAdmin = Util.isAdmin($location);
    });
  });
