'use strict';

angular.module('devicelibApp').factory('Loan', function($resource) {
  var resource = $resource(
    '/api/loans/:id',
    {id: '@_id'},
    {
      update: {
        method: 'PUT'
      }
    }
  );
  return resource;
});
