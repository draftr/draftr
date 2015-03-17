define(['store'], function (store) {
  'use strict';

  return {
    isAuthenticated: function isAuthenticated() {
      return this.accessToken() !== null;
    },
    accessToken: function accessToken() {
      return store.get('accessToken', null);
    }
  };
});