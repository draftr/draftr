var User            = require('../../../model/user'),
    WorkSpace       = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function read(req, res) {
  'use strict';

  req.assert('workSpaceId').isMongoId();

  var errors;

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  if (true === req.user.isAllowed('admin')) {
    return res.api(200, null, {isAllowed: true, right: "admin"});
  }

  WorkSpace.findOne(
    {
      _id: req.params.workSpaceId,
      "users": { "$elemMatch": { "user": req.user.id, "isOwner": true} }
    }, function(err, result) {
      if (err) {
        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      }

      if (!result) {
        return res.api(200, null, {isAllowed: false, right: "permission denied"});
      }

      return res.api(200, null, {isAllowed: true, right: "owner"});
    })

};