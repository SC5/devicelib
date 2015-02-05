'use strict';

angular.module('devicelibApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'History',
      'link': '/history'
    }, {
      'title': 'Users',
      'link': '/users'
    }, {
      'title': 'Devices',
      'link': '/devices'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });