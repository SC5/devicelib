'use strict';

angular.module('devicelibApp')
  .controller('HistoryCtrl', function ($scope, $http, socket) {
    $scope.loans = [];
    $http.get('/api/loans').success(function(loans) {
      $scope.loans = loans;
      socket.syncUpdates('loans', $scope.loans);
    });
  });
