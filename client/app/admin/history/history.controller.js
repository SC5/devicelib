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
      setLoading(false);
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

    // TODO make sortable from ui
    $scope.pageChanged = function() {
      setLoading(true, true);
      $scope.loans = Loan.query(
        {
          skip: $scope.itemsPerPage * ($scope.currentPage-1),
          limit: defaultLimitPerPage,
          sortField: $scope.field,
          sortType: $scope.sort.type
        }, function() {
          setLoading(false);
        });
    };

    /**
     *
     * @param status - Boolean loading status
     * @param force - Boolean true will set loading immeadiately
     */
    function setLoading(status, force) {
      if (force) {
        $scope.loading = status;
      } else {
        $timeout(function() {
          $scope.loading = status;
        }, 200);
      }
    }

  });
