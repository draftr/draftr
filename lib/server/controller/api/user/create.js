var Model           = require('../../../model/user'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    crypto          = require('crypto');

module.exports = function create(req, res) {
  'use strict';

  var user, errors;

  req.assert('nickname').notEmpty().isLength(3, 50);
  req.assert('emailAdress').notEmpty().isEmail();
  req.assert('password').notEmpty().isLength(3, 50);

  errors = req.validationErrors();

  if (errors) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  user = new Model({
      emailAdress: req.body.emailAdress,
      nickname: ('' + req.body.nickname).trim(),
      password: crypto.createHash('sha1').update(('' + req.body.password).trim()).digest('hex'),
  });

  user.save(function (err, entity) {
    console.log(err);
    if (err) {
      return res.api(new StatusError(400, 'Duplicate key', err));
    }

    return res.api(200, null, entity.toResObject());
  });
};