var validator       = require('validator')
    Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error');

module.exports = function read(req, res) {
  'use strict';

  var errors, isUserId;

  req.assert('id').isMongoId();

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid id', errors));
  }

  isUserId = validator.isMongoId(req.params.userId);

  Model.findOne({_id: req.params.id }).populate('users.user').exec(function(err, result) {
    if (err) {
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if (!result) {
      return res.api(new StatusError(404, 'Cannot find WorkSpace by id "' + req.params.id + '"', 'not_found'));
    }

    if (true === isUserId) {
      var index;

      for (index = 0; index < result.users.length; index++) {
        if (("" + result.users[index].user._id) === req.params.userId) {
          return res.api(200, null, result.users[index]);
        }
      };
    } else {
      return res.api(200, null, result.users);
    }
  });
}