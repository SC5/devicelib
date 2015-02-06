'use strict';

angular.module('devicelibApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin/history', {
        templateUrl: 'app/admin/history/history.html',
        controller: 'HistoryCtrl'
      });
  });
