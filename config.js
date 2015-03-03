'use strict';

module.exports = {
  prod: {
    port: 1337,
    queue: {
      port: 1338
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