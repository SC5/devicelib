'use strict';

angular.module('devicelibApp')
.controller('UsersCtrl', function ($scope, socket, User, Modal) {
  
  $scope.alerts = [];
  $scope.users = User.query();
  socket.syncUpdates('user', $scope.users);

  $scope.removeUser = function(user) {
    $scope.displayModal = Modal.confirm.remove('user ' + user.name, function(remove) {
      if (remove) {
        User.remove({id: user._id});
        $scope.addAlert('success', 'User deleted');
      }
    });
    $scope.displayModal();
  };

  $scope.addAlert = function(type, msg) {
    $scope.alerts.push({type: type, msg: msg});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.$on('$destroy', function () {
    socket.unsyncUpdates('users');
  });
});
