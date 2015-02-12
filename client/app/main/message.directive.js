'use strict';

angular.module('devicelibApp').directive('message', [
  '$document', '$log', 'socket',
  function($document, $log, socket) {
    return {
      restrict: 'E',
      link: function(scope) {

      }
    };
  }
]);
