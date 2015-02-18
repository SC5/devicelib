'use strict';

angular.module('devicelibApp')
  .service('LoanHistory', function ($q, $http) {
    return {
      getLoans: function(limit, sortField, sortType) {
        var defer = $q.defer();

        // Using $http instead of Loan $resource because of meta information (meta.totalItems)
        $http({
          url: '/api/loans',
          params: {skip: 0, limit: limit, sortField: sortField, sortType: sortType },
          method: 'GET'
        })
        .error(function(err) {
          defer.reject(err);
        })
        .success(function(data) {
          defer.resolve({
            totalItems: data.meta.totalItems,
            loans: data.results
          });
        });
        return defer.promise;
      }
    }
  });
