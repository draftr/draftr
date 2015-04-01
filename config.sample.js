'use strict';

module.exports = {
  prod: {
    port: 1337,
    kue: {
      prefix: 'queue',
      redis: {
        port: 6379,
        host: '127.0.0.1'
        // auth: 'yourpassword'
      }
    },
    db: {
      sets: [
        'localhost/draftr'
      ],
      options: {}
    },
    token: {
      secret: 'a0f0d3e0aa'
    },
    feedReader: {
      updateInterval: 60 * 10 * 1000 // 10m
    }
  },
  dev: {
  },
  local: {
  },
  test: {
  }
};