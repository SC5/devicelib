'use strict';

angular.module('devicelibApp').directive('rfidEvent', [
  '$document', '$log', 'socket',
  function($document, $log, socket) {
    return {
      restrict: 'A',
      link: function() {
        $document.bind('keypress', function(e) {
          if (e.target.nodeName.toLowerCase() !== 'input' && e.which === 114) {
            $log.debug('Triggering RFID event');
            socket.socket.emit('development:rfid');
          }
        });
      }
    };
  }
]);
