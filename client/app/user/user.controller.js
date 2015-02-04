'use strict';

angular.module('devicelibApp')
  .controller('UserCtrl', function ($scope, socket, $routeParams, $window, User) {
    $scope.alerts = [];

    if ($routeParams.id && $routeParams.id !== '') {
      $scope.user = User.get({id:$routeParams.id});
    } else {
      $scope.user = new User();
    }

    $scope.$back = function() {
      $window.history.back();
    };

    socket.syncUpdates('rfid', [], function(event, rfid) {
      $scope.user.rfid = rfid;
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('rfid');
    });

    $scope.save = function() {
      if ($scope.user._id) {
        $scope.user.$update(function() {
          $scope.addAlert('success', 'User saved');
       });
      } else {
        $scope.user.$save(function() {
          $scope.addAlert('success', 'New user created');
        });
      }
    };

    $scope.addAlert = function(type, msg) {
      $scope.alerts.push({type: type, msg: msg});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  });