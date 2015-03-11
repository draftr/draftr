var Model           = require('../../../model/user'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    crypto          = require('crypto');

module.exports = function update(req, res) {
  'use strict';

  req.assert('id').isMongoId();
  req.assert('nickname').notEmpty().isLength(3, 50);
  req.assert('emailAdress').notEmpty().isLength(3, 50);
  req.assert('password').notEmpty().isLength(3, 50);

  var errors;

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  Model.findOneAndUpdate(
    { _id: req.params.id },
    {
      nickname: ('' + req.body.nickname).trim(),
      password: crypto.createHash('sha1').update(('' + req.body.password).trim()).digest('hex'),
      emailAdress: req.body.emailAdress
    },
    function(err, entity) {
      if (err) {
        return res.api(new StatusError(400, 'Invalid data', err));
      }

      return res.api(200, null, entity.toResObject());
    }
  );
};