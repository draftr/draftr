var Reader          = require('../../../api/reader'),
    model           = require('../../../model/article'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function update(req, res) {
  'use strict';

  var where, errors,
      query = _.object();

  req.checkParams('id').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  where = {_id: req.params.id};

  if (req.body.title) {
    query.title = req.body.title;
  }
  if (req.body.url) {
    query.url = req.body.url;
  }
  if (req.body.body) {
    query.body = req.body.body;
  }

  model.findOneAndUpdate(where, query, {},function(err, entity) {
    if (err) {
      return res.api(new StatusError(400, 'Invalid data', err));
    }

    return res.api(200, null, entity);
  });

};