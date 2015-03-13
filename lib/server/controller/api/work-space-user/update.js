var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function update(req, res) {
  'use strict';

  req.assert('id').isMongoId();
  req.assert('userId').isMongoId();
  req.assert('moderator').notEmpty();
  req.assert('owner').notEmpty();

  var errors;

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid data', errors));
  }

  Model.findOne({ _id: req.params.id }, function(err, user) {
      if (err) {
        return res.api(new StatusError(400, 'Invalid data', err));
      }

      user.users.forEach(function (err, entity) {
        if (String(entity.user) === req.params.userId) {
          entity.isModerator = req.body.moderator;
          entity.isOwner     = req.body.owner;

          user.save(function(err, user){
            if (err) {
              return res.api(new StatusError(400, 'Invalid data', err));
            }

            return res.api(200, null, user);
          });
        }
      });
    }
  );
};