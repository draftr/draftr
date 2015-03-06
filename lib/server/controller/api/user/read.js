var Reader = require('../../../api/reader'),
    model  = require('../../../model/user');

module.exports = function read(req, res) {
  'use strict';

  var reader;

  reader = new Reader(model, req, res, {
    isAllowed: [
      function isItMe() {
        return req.user.isAllowed('admin') || req.user && req.user.id === req.params.id;
      }
    ]
  });

  reader.execute();
};