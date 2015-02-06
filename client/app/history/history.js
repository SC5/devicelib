'use strict';

angular.module('devicelibApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin/history', {
        templateUrl: 'app/history/history.html',
        controller: 'HistoryCtrl'
      });
  });
