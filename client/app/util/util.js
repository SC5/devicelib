'use strict';
angular.module('devicelibApp').factory('Util', function () {
  return {
    isAdmin: function ($location) {
      return $location.path().indexOf('/admin') === 0;
    }
  };
});
