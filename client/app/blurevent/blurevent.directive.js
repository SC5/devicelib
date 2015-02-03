'use strict';

angular.module('devicelibApp')
  .directive('blurevent', function () {
    return {
      restrict: 'A',
      link: function(scope, element) {
        element.on('blur', function() {
          scope.clientFieldChanged(scope.device);
        });
      }
    };
  });
