'use strict';

angular.module('devicelibApp')
  .controller('HistoryCtrl', function ($scope, $http, $log, $timeout, socket, Loan) {
    var defaultLimitPerPage = 20;
    $scope.loading = true;
    $scope.sort = {field: 'end', type: 'desc'};

    // Using $http instead of Loan $resource because of meta information (meta.totalItems)
    $http({
      url: '/api/loans',
      params: {skip: 0, limit: defaultLimitPerPage, sortField: $scope.sort.field, sortType: $scope.sort.type },
      method: 'GET'
    })
    .success(function(data) {
      $scope.totalItems = data.meta.totalItems;
      $scope.loans = data.results;
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
    }

    // TODO make sortable from ui
    $scope.pageChanged = function() {
      var items = Loan.query(
        {
          skip: $scope.itemsPerPage * ($scope.currentPage-1),
          limit: defaultLimitPerPage,
          sortField: $scope.sort.field,
          sortType: $scope.sort.type
        }, function() {
          $scope.loans = items;
        });
    };

  });
