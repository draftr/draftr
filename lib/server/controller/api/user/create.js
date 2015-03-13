var crypto          = require('crypto'),
    Model           = require('../../../model/user'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    util            = require('../../../util');

module.exports = function create(req, res) {
  'use strict';

  var user, errors;

  req.assert('nickname').notEmpty().isLength(3, 50);
  req.assert('emailAdress').notEmpty().isEmail();
  req.assert('password').notEmpty().isLength(3, 50);

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  user = new Model({
    emailAdress: req.body.emailAdress,
    nickname: ('' + req.body.nickname).trim(),
    password: crypto.createHash('sha1').update(('' + req.body.password).trim()).digest('hex'),
  });

  user.save(function (err, entity) {
    if (err) {
      if (util.detectMongoDbDuplicationErrorKey(err)) {
        return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
      }

      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    return res.api(201, null, entity.toResObject());
  });
};