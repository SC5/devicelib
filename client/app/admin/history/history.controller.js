'use strict';

angular.module('devicelibApp')
  .controller('HistoryCtrl', function ($scope, $http, $log, $timeout, socket, Loan, LoanHistory) {
    var defaultLimitPerPage = 20;
    $scope.loading = true;
    $scope.sort = {field: 'end', type: 'desc'};

    LoanHistory.getLoans(defaultLimitPerPage, $scope.sort.field, $scope.sort.type)
    .then(function(result) {
      $scope.totalItems = result.totalItems;
      $scope.loans = result.loans;
    });

    socket.syncUpdates('loan', [], function(event, item) {
      $scope.loans.forEach(function(loan, iter) {
        if (loan._id === item._id) {
          $scope.loans[iter] = item;
        }
      });
    });

    $scope.currentPage = 1;
    $scope.itemsPerPage = defaultLimitPerPage;

    $scope.sortBy = function(field) {
      if ($scope.sort.field === field) {
        $scope.sort.type = $scope.sort.type === 'desc' ? 'asc' : 'desc';
      } else {
        $scope.sort.field = field;
      }
      $scope.currentPage = 1;
      $scope.pageChanged();
    };

    // TODO make sortable from ui
    $scope.pageChanged = function() {
      var items = Loan.query(
        {
          skip: $scope.itemsPerPage * ($scope.currentPage-1),
          limit: defaultLimitPerPage,
          sortField: $scope.sort.field,
          sortType: $scope.sort.type
        },
        function() {
          $scope.loans = items;
        }
      );
    };
  });
