var User            = require('../../../model/user'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function read(req, res) {
  'use strict';

  User.findOne({
    $or:[ {'username': req.body.search}, {'emailAddress':req.body.search} ]
  }, function(err, entitiy) {
    if (err) {
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if (!entitiy) {
      return res.api(new ValidationError(400, 'Cannot find user value"' + req.body.search + '"', 'not_found'));
    }
    console.log(entitiy);
    return res.api(200, null, entitiy.toResObject());
  });
};