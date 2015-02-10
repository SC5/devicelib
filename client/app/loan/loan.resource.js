'use strict';

angular.module('devicelibApp').factory('Loan', function($resource) {
  var resource = $resource(
    '/api/loans/:id',
    {id: '@_id'},
    {
      update: {
        method: 'PUT'
      },
      query: {
        isArray:true,
        method:'get',
        transformResponse: function (data) {
          return JSON.parse(data).results;
       }}
    }
  );
  return resource;
});
