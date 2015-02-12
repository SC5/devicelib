'use strict';

angular.module('devicelibApp')
.controller('MessageCtrl', function ($scope, socket, $timeout) {
  $scope.alerts = [];
  $scope.addAlert = function(type, msg) {
    $scope.alerts.push({type: type, msg: msg});
  };
  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  socket.socket.on('device:save', function(item) {
    if (item.status === 'available') {
      $scope.alerts.push(
        {type: 'success', msg: 'Well done! You successfully returned ' + item.name + ' (' + item.label + ')'}
      );
    } else {
      $scope.alerts.push({ type: 'danger', msg: 'Next time swipe your RFID tag before taking the device.'});
    }
    $timeout(function() {
      $scope.closeAlert($scope.alerts.length -1);
    }, 5000);
  });

});
