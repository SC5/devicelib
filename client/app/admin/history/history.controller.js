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

  }).directive('tableSortIndicator', function($compile) {
    // Binds to TR child elements and appends <span> on click events
    return {
      restrict: 'A',
      link: function(scope, element) {
        var angularTemplate = $compile(
          '<span ng-class="{\'glyphicon-chevron-up\': sort.type===\'desc\', '+
           '\'glyphicon-chevron-down\': sort.type===\'asc\'}" class="glyphicon" aria-hidden="true"></span>'
        );
        var children = element[0].children || [];
        for (var i = 0; i < children.length; ++i) {
          angular.element(children[i]).on('click', function(e) {
            var el = angular.element(e.target);
            var compiled = angularTemplate(scope);
            el.append(compiled);
          });
        }
      }
    }
  });
