'use strict';

angular.module('devicelibApp').directive('screensaver', function($window, $location, $interval, $log) {
  var screensaverTimeoutPromise;
  var screensaverTimeoutSeconds = 2;
  return {
    templateUrl: 'app/screensaver/screensaver.html',
    link: function($scope, element) {
      if (screensaverTimeoutSeconds === 0) {
        return;
      }
      $log.debug('init screen saver directive');

      function showScreensaver() {
        $log.debug('enable screen saver');
        $interval.cancel(screensaverTimeoutPromise);
        var previousClass = $scope.screensaverClass;
        var allClasses = ['left', 'center', 'right'];
        var classes = [];
        for (var i = 0; i < allClasses.length; i++) {
          if (previousClass !== allClasses[i]) {
            classes.push(allClasses[i]);
          }
        }
        $scope.screensaverClass = Math.random() <= 0.5 ? classes[0] : classes[1];
        $scope.screensaver = true;
        if ($location.path() === '/devices') {
          $scope.label = 'Control Panel';
        } else {
          $scope.label = 'Label: ' + $window.localStorage.getItem('label') || '';
        }
        screensaverTimeoutPromise = $interval(showScreensaver, screensaverTimeoutSeconds*1000);
      }

      screensaverTimeoutPromise = $interval(showScreensaver, screensaverTimeoutSeconds*1000);
      angular.element('body').on('click', function() {
        $scope.$apply(function() {
          resetScreensaverCounter();
        });
      });
      angular.element('body').on('touchstart', function() {
        $scope.$apply(function() {
          resetScreensaverCounter();
        });
      });

      $scope.$on('screensaver', function() {
        resetScreensaverCounter();
      });

      function resetScreensaverCounter() {
        $interval.cancel(screensaverTimeoutPromise);
        if ($scope.screensaver) {
          hideScreensaver();
        }
        screensaverTimeoutPromise = $interval(showScreensaver, screensaverTimeoutSeconds*1000);
      }

      function hideScreensaver() {
        $log.debug('disable screen saver');
        $scope.screensaver = false;
      }
      resetScreensaverCounter();
    }
  };
});