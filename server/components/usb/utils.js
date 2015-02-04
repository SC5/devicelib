module.exports.isMobileDevice = function(device) {
  var deviceName;
  if (device.deviceName) {
    deviceName = device.deviceName
  } else if (device.DEVTYPE && device.DEVTYPE === 'usb_device') {
    deviceName = device.ID_SERIAL;
  } else {
    return false;
  }
  return /(iphone|android|sailfish|nokia|ipad)/i.test(deviceName);
}