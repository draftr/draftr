var Model           = require('../../../model/article'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    util            = require('../../../util');

module.exports = function update(req, res) {
  'use strict';

  req.assert('id').isMongoId();
  req.assert('title').notEmpty().isLength(3, 50);
  req.assert('body').isLength(3);

  var errors;

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  Model.findOneAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      body: req.body.body
    },
    function(err, entity) {
      if (err) {
        if (util.detectMongoDbDuplicationErrorKey(err)) {
          return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
        }
        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      }

      if (!entity) {
        return res.api(new StatusError(404, 'Cannot find article by id "' + req.params.id + '"', 'not_found'));
      }

      return res.api(200, null, entity.toResObject());
    }
  );
};