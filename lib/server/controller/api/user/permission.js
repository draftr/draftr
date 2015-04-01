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
      "users": { "$elemMatch": { "user": req.user.id} }
    }, function(err, result) {

    if (err) {
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if (!result) {
      return res.api(new ValidationError(400, 'Cannot find user', 'not_found'));
    }
    for (var i = 0; i < result.users.length; i++) {
      if (("" + result.users[i].user) === req.user.id) {
         if (result.users[i].isOwner === true) {
            return res.api(200, null, {right: 'owner'});
         } else if (result.users[i].isAdmin) {
            return res.api(200, null, {right: 'admin'});
         } else if (result.users[i].isModerator) {
            return res.api(200, null, {right: 'moderator'});
         } else {
            return res.api(400, null, {right: false});
         }
      }
    }
  });
};