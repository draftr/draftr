var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error');

module.exports = function read(req, res) {
  'use strict';

  var errors;

  req.assert('id').isMongoId();

  errors = req.validationErrors();

  if (errors) {
    return res.api(new ValidationError(400, 'Invalid id', errors));
  }

  Model.findOne({ _id: req.params.id}, function (err, workSpace){
    if (err) {
      return res.api(new ValidationError(400, 'Invalid data', errors));
    }

    req.assert('userId').isMongoId();

    errors = req.validationErrors();

    if (errors) {
      return res.api(200, null, workSpace.users);
    }

    workSpace.users.forEach(function (user) {
      if (req.params.userId === String(user.user)) {
        return res.api(200, null, user);
      }
    });
  });
}