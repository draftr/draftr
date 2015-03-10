var Reader   = require('../../../api/reader'),
    model    = require('../../../model/feed');

module.exports = function update(req, res) {
  'use strict';

  var where = {_id: req.params.id},
      data  = {url: req.body.url,};


  model.findOneAndUpdate(where, data, {},function(err, entity) {
    if(err) {
      res.api(400, null, err);

      return err;
    }
    res.api(200, null, entity);

    return entity
  });
};