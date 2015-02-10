'use strict';

angular.module('devicelibApp')
.controller('MainCtrl', function ($scope, $http, socket, $timeout, rfid, $location, $log, Device, Modal, User) {

  $scope.alerts = [];
  $scope.user = null;

  $scope.addAlert = function(type, msg) {
    $scope.alerts.push({type: type, msg: msg});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.devices = Device.query();
  socket.syncUpdates('device', $scope.devices);

  socket.syncUpdates('user', [], function(event, user) {
    if(user.nonregistered) {
      $scope.displayModal = Modal.confirm.newUser(function(res) {
        user.name = res.name;
        user.email = res.email;
        user.nonregistered = false;
        user.active = true;
        User.update(user);
      });
      $scope.displayModal();
    }
    else {
      if (user.active) {
        $scope.user = {name: user.name};
        $scope.showLoans = true;
        rfid.user = user;
        $location.path('/loan');
      }
    }
  });

  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('device');
    socket.unsyncUpdates('user');
  });

  $scope.clientFieldChanged = function(model) {
    var device = Device.get({id:model._id}, function() {
      device = angular.extend(device, model);
      device.$update();
    });
  };
});
