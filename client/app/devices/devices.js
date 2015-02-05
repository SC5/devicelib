'use strict';

angular.module('devicelibApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/devices', {
        templateUrl: 'app/devices/devices.html',
        controller: 'DevicesCtrl'
      });
  });
