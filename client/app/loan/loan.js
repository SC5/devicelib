'use strict';

angular.module('devicelibApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/loan', {
        templateUrl: 'app/loan/loan.html',
        controller: 'LoanCtrl'
      });
  });
