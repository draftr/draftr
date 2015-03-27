var validator       = require('validator')
    WorkSpace       = require('../../../model/work-space'),
    Articles        = require('../../../model/article'),
    ValidationError = require('../../../error/validation-error'),
    Promise         = require('bluebird'),
    StatusError     = require('../../../error/status-error');

module.exports = function read(req, res) {
  'use strict';

  var errors, isFeedId;

  req.assert('id').isMongoId();

  if ((errors = req.validationErrors())) {
    return res.api(new ValidationError(400, 'Invalid id', errors));
  }

  isFeedId = validator.isMongoId(req.params.feedId);

  WorkSpace.findOne({_id: req.params.id }).populate('feeds').exec(function(err, result) {
    if (err) {
      return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
    }

    if (!result) {
      return res.api(new StatusError(404, 'Cannot find WorkSpace by id "' + req.params.id + '"', 'not_found'));
    }

    var promises = [];

    for (var i=0, l=result.feeds.length; i<l; i++) {
      var opts = [
        {
          path: 'articles',
          model: Articles,
          options: {
            limit: 5,
            sort: { 'createdAt': -1 }
          }
        }
      ];

      promises.push(WorkSpace.populate(result.feeds[i], opts));
    }

    Promise.all(promises)
      .then(function(feeds) {
        if (true === isFeedId) {
          var index;

          for (index = 0; index < feeds.length; index++) {
            if (("" + feeds[index]._id) === req.params.feedId) {
              return res.api(200, null, feeds[index]);
            }
          };
        } else {
          return res.api(200, null, feeds);
        }
      })
      .catch(function() {
        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      })
  });
}