'use strict';

angular.module('devicelibApp')
  .controller('UsersCtrl', function ($scope, $http) {
    $scope.users = [];

    $http.get('/api/users').success(function(users) {
      $scope.users = users;
    });
  });
