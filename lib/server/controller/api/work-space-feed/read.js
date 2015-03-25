var validator       = require('validator')
    Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error'),
    StatusError     = require('../../../error/status-error');

module.exports = function read(req, res) {
  'use strict';

  var errors, isFeedId;

  req.assert('id').isMongoId();

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid id', errors));
  }

  isFeedId = validator.isMongoId(req.params.feedId);

  Model.findOne({_id: req.params.id }).populate('feeds').exec(function(err, result) {
    if (err) {
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if (!result) {
      return res.api(new StatusError(404, 'Cannot find WorkSpace by id "' + req.params.id + '"', 'not_found'));
    }

    if (true === isFeedId) {
      var index;

      for (index = 0; index < result.feeds.length; index++) {
        if (("" + result.feeds[index]._id) === req.params.feedId) {
          return res.api(200, null, result.feeds[index]);
        }
      };
    } else {
      return res.api(200, null, result.feeds);
    }
  });
}