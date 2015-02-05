'use strict';

describe('Directive: screensaver', function () {

  // load the directive's module
  beforeEach(module('devicelibApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<screensaver></screensaver>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the screensaver directive');
  }));
});