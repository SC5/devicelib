'use strict';

angular.module('devicelibApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/logout', {
        templateUrl: 'app/logout/logout.html',
        controller: 'LogoutCtrl'
      });
  });
