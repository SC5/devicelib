'use strict';

describe('Directive: blurevent', function () {

  // load the directive's module
  beforeEach(module('devicelibApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<blurevent></blurevent>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the blurevent directive');
  }));
});