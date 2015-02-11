'use strict';

angular.module('devicelibApp')
  .controller('LogoutCtrl', function ($timeout, $location, rfid) {
    rfid.logout().then(function() {
      $timeout(function() {
        $location.path('/');
      }, 5000);
    }, function() {
      $location.path('/');
    });
  });
