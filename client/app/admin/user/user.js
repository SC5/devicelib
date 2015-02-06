'use strict';

angular.module('devicelibApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin/user/:id', {
        templateUrl: 'app/admin/user/user.html',
        controller: 'UserCtrl'
      })
      .when('/admin/user/', {
        templateUrl: 'app/admin/user/user.html',
        controller: 'UserCtrl'
      });
  });
