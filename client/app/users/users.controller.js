'use strict';

angular.module('devicelibApp')
.controller('UsersCtrl', function ($scope, User) {
	
  $scope.alerts = [];
	$scope.users = User.query();

	$scope.removeUser = function(user) {
		User.remove({id: user._id});
    $scope.users = User.query();
		$scope.addAlert('success', 'User deleted');
	};

	$scope.addAlert = function(type, msg) {
		$scope.alerts.push({type: type, msg: msg});
	};

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};
});
