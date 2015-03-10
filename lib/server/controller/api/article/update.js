var Reader   = require('../../../api/reader'),
    model    = require('../../../model/article');

module.exports = function update(req, res) {
  'use strict';

  var where = {_id: req.params.id},
      query = {
        title: req.body.title,
        body:  req.body.body,
        url:   req.body.url
      };


  model.findOneAndUpdate(where, query, {},function(err, model) {
    if(err) {
      res.api(400, null, err);
      return err;
    }
    res.api(200, null, model);

  });
};