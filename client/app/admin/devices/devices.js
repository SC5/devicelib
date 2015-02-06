'use strict';

angular.module('devicelibApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin/devices', {
        templateUrl: 'app/admin/devices/devices.html',
        controller: 'DevicesCtrl'
      });
  });
