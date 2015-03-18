define(['store'], function (store) {
  'use strict';

  return {
    isAuthenticated: function isAuthenticated() {
      return this.accessToken() !== null;
    },
    accessToken: function accessToken(value) {
      if (typeof value !== 'undefined') {
        store.set('accessToken', value);

        return value;
      }

      return store.get('accessToken', null);
    }
  };
});