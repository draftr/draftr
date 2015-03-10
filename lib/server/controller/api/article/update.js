var Model           = require('../../../model/article'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function update(req, res) {
  'use strict';

  req.assert('id').isMongoId();
  req.assert('title').notEmpty().isLength(3, 50);
  req.assert('url').isURL();
  req.assert('body').isLength(3);

  var errors;

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  Model.findOneAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      url: req.body.url,
      body: req.body.body
    },
    function(err, entity) {
      if (err) {
        return res.api(new StatusError(400, 'Invalid data', err));
      }

      return res.api(200, null, entity.toResObject());
    }
  );
};