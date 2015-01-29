'use strict';

angular.module('devicelibApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/:id', {
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl'
      })
      .when('/user/', {
        templateUrl: 'app/user/user.html',
        controller: 'UserCtrl'
      });
  });
