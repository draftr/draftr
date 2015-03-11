var Reader = require('../../../api/reader'),
    Model  = require('../../../model/article');

module.exports = function read(req, res) {
  'use strict';

  var reader;

  reader = new Reader(Model, req, res);
  reader.execute();
};