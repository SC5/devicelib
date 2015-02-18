'use strict';

angular.module('devicelibApp')
  .directive('tableSortIndicator', function($compile) {
    // Binds to TR child elements and appends <span> on click events
    return {
      restrict: 'A',
      link: function(scope, element) {
        var angularTemplate = $compile(
          '<span ng-class="{\'glyphicon-chevron-up\': sort.type===\'desc\', '+
           '\'glyphicon-chevron-down\': sort.type===\'asc\'}" class="glyphicon" aria-hidden="true"></span>'
        );
        var children = element.children().map(function(i, th) {
          if (!angular.element(th).hasClass('no-sort')) {
            return th;
          }
        });
        for (var i = 0; i < children.length; ++i) {
          angular.element(children[i]).on('click', function(e) {
            var el = angular.element(e.target);
            var compiled = angularTemplate(scope);
            el.append(compiled);
          });
        }
      }
    }
  });
