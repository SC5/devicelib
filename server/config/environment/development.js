'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/devicelib-dev'
  },

  seedDB: false,
  salt: '000001'
};
