var Reader          = require('../../../api/reader'),
    model           = require('../../../model/article'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function dell(req, res) {
  'use strict';

  var where = {},
      errors;

  req.checkParams('id').notEmpty();

  errors = req.validationErrors();

  if (errors) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  where = {_id: req.params.id};

  model.findOneAndRemove(where,function(err, entity) {
    if (err) {
      return res.api(new StatusError(400, 'Invalid id', err));
    }

    if (!entity) {
      return res.api(new StatusError(400, 'Invalid id', req.params.id));
    }

    return res.api(200, null, entity);
  });
};