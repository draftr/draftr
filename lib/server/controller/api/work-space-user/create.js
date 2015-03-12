var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function create(req, res) {
  'use strict';

  var errors;

  req.assert('id').isMongoId();
  req.assert('user').isMongoId();
  req.assert('moderator').isNumeric();
  req.assert('owner').isNumeric();

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

 Model.findOneAndUpdate(
    { _id: req.params.id },
    { $push:
      {
      users:
        {
          user: req.body.user,
          isModerator: req.body.moderator,
          isOwner: req.body.owner
        }
      }
    },
    function(err, entity) {
      if (err) {
        return res.api(new StatusError(400, 'Invalid data', err));
      }

      return res.api(200, null, entity.toResObject());
    }
  );
};