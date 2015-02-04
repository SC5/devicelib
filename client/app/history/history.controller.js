'use strict';

angular.module('devicelibApp')
  .controller('HistoryCtrl', function ($scope, $http, socket, Loan) {
    $scope.loans = Loan.query();
    socket.syncUpdates('loan', $scope.loans);
  });
