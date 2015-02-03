angular.module('devicelibApp').factory('Device', function($resource) {
  var resource = $resource(
    '/api/devices/:id',
    {id: '@_id'},
    {
      update: {
        method: 'PUT'
      }
    }
  );
  return resource;
});
