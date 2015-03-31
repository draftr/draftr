define(['draftr/auth', 'socket.io'], function (auth, io) {
  'use strict';

  var isInitialized;

  return {
    initialize: function initialize() {
      var self = this;

      auth.user(function () {
        if (isInitialized) {
          return;
        }

        isInitialized = true;

        self.socket = io.connect('', {
          query: 'access_token=' + auth.accessToken()
        });

        self.socket.on('disconnect', function () {
          self.socket = undefined;
          console.log('disconnected');
        });
      }, true);
    },
    socket: undefined
  };
});