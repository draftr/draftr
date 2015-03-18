var Model           = require('../../../model/work-space'),
    User            = require('../../../model/user'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error'),
    util            = require('../../../util'),
    validator       = require('validator');

module.exports = function create(req, res) {
  'use strict';

  var errors;

  req.assert('id').isMongoId();
  req.assert('user').isMongoId();
  req.assert('isModerator').notEmpty();
  req.assert('isOwner').notEmpty();

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  Model.findOne({_id : req.params.id, 'users.user' : req.body.user },function(err,result){
    if (err) {
      if (util.detectMongoDbDuplicationErrorKey(err)) {
        return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
      }

      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if(result) {
      return res.api(new StatusError(400, 'Duplicate key', 'duplicate'));
    }

    User.findOne({ _id: req.body.user}, function(err, user) {
      if (err) {
        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      }

      if (!user) {
        return res.api(new StatusError(404, 'Cannot find User by id "' + req.params.id + '"', 'not_found'));
      }

      Model.findOneAndUpdate(
        { _id: req.params.id },
        { $push:
          {
          users:
            {
              user: req.body.user,
              isModerator: validator.toBoolean(req.body.isModerator),
              isOwner: validator.toBoolean(req.body.isOwner)
            }
          }
        },
        function (err, entity) {
          if (err) {
            return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
          }

          return res.api(201, null, entity.toResObject());
        }
      );
    });
  });
};