var Model           = require('../../../model/work-space'),
    ValidationError = require('../../../error/validation-error');

module.exports = function read(req, res) {
  'use strict';

  var errors;

  req.assert('id').isMongoId();

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid id', errors));
  }

  Model.findOne({ _id: req.params.id}, function (err, workSpace){
    if (err) {
        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if (!workSpace) {
      return res.api(new StatusError(404, 'Cannot find WorkSpace by id "' + req.params.id + '"', 'not_found'));
    }

    req.assert('feedId').isMongoId();

    if ((errors = req.validationErrors())) {
      return res.api(400, null, errors);
    }

    workSpace.feeds.forEach(function (feed) {
      if (req.params.feedId === String(feed)) {
        return res.api(200, null, feed);
      }
    });
  });
}