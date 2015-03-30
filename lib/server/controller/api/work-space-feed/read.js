var validator        = require('validator')
    WorkSpace        = require('../../../model/work-space'),
    Article          = require('../../../model/article'),
    ValidationError  = require('../../../error/validation-error'),
    Promise          = require('bluebird'),
    StatusError      = require('../../../error/status-error');

module.exports = function read(req, res) {
  'use strict';

  var errors, isFeedId, articles = [], index, key;

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
          model: Article,
          options: {
            limit: 10,
            sort: { 'createdAt': -1 }
          }
        }
      ];

      promises.push(WorkSpace.populate(result.feeds[i], opts));
    }

    Promise.all(promises)
      .then(function(feeds) {
        if (true === isFeedId) {
          for (index = 0; index < feeds.length; index++) {
            if (("" + feeds[index]._id) === req.params.feedId) {
              return res.api(200, null, feeds[index]);
            }
          }
        } else {
          for (index = 0; index < feeds.length; index++) {
            for (key = 0; key < feeds[index].articles.length; key++) {
               articles.push(feeds[index].articles[key]);
            }
          }

          articles.sort(function(a, b) {
            a = new Date(a.createdAt);
            b = new Date(b.createdAt);
            return a>b ? -1 : a<b ? 1 : 0;
          });

          return res.api(200, null, articles);
        }
      })
      .catch(function() {
        return res.api(new StatusError(500, 'Internal Server Error', 'internal_error'));
      })
  });
}