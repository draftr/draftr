var Reader   = require('../../../api/reader'),
    model    = require('../../../model/article');

module.exports = function dell(req, res) {
  'use strict';

  var where = {_id: req.params.id};

  model.findOneAndRemove(where,function(err, model) {
    if(err) {
      res.api(400, null, err);
      return err;
    }
    res.api(200, null, model);
  });
};