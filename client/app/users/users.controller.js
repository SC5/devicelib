'use strict';

angular.module('devicelibApp')
  .controller('UsersCtrl', function ($scope, User) {
    $scope.users = User.query();
  });
