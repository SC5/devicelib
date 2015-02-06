'use strict';

angular.module('devicelibApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('admin/loan', {
        templateUrl: 'app/admin/loan/loan.html',
        controller: 'LoanCtrl'
      });
  });
