var Reader = require('../../../api/reader'),
    model  = require('../../../model/article');

module.exports = function read(req, res) {
  'use strict';
  var reader;

  reader = new Reader(model, req, res);
  reader.execute();
};