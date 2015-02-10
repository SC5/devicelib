'use strict';

angular.module('devicelibApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.isAdmin = $location.path().indexOf('/admin') === 0;
    $scope.menu = [{
      'title': 'Home',
      'link': '/admin'
    }, {
      'title': 'History',
      'link': '/admin/history'
    }, {
      'title': 'Users',
      'link': '/admin/users'
    }, {
      'title': 'Devices',
      'link': '/admin/devices'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });