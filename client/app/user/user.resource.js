angular.module('devicelibApp').factory('User', function($resource) {
  var resource = $resource(
    '/api/users/:id',
    {id: '@_id'},
    {
      update: {
        method: 'PUT'
      }
    }
  );
  return resource;
});
