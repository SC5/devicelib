'use strict';

angular.module('devicelibApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      }).when('/admin', {
        redirectTo: function() {
          return '/admin/devices';
        }
      });
  });
