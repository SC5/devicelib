'use strict';

describe('Service: rfid', function () {

  // load the service's module
  beforeEach(module('devicelibApp'));

  // instantiate service
  var rfid;
  beforeEach(inject(function (_rfid_) {
    rfid = _rfid_;
  }));

  it('should do something', function () {
    expect(!!rfid).toBe(true);
  });

});
