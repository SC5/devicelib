'use strict';

angular.module('devicelibApp')
  .controller('UserCtrl', function ($scope, socket, $http, $routeParams) {
    $scope.alerts = [];
    $scope.name = '';
    $scope.rfid = '';
    $scope.id = '';

    if ($routeParams.id && $routeParams.id !== '') {
      $http.get('/api/users/' + $routeParams.id).success(function(user) {
        $scope.name = user.name;
        $scope.rfid = user.rfid;
        $scope.id = user._id;
      })
    }

    $scope.$back = function() {
      window.history.back();
    };

    socket.syncUpdates('rfid', [], function(event, rfid) {
      $scope.rfid = rfid;
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('rfid');
    });

    $scope.save = function() {
      var userData = {name: $scope.name, rfid: $scope.rfid};
      if ($scope.id) {
        $http.put('/api/users/' + $scope.id, userData).success(function(user) {
          $scope.addAlert('success', 'User saved');
       });
      } else {
        $http.post('/api/users', userData).success(function(user) {
          $scope.addAlert('success', 'User saved');
        });
      }

    }

    $scope.addAlert = function(type, msg) {
      $scope.alerts.push({type: type, msg: msg});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  });
