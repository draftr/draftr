var readability = require('node-readability'),
    crypto      = require('crypto'),
    Article     = require('../model/article'),
    Feed        = require('../model/feed'),
    draftr      = require('../draftr');

module.exports = function articleReader(job, done) {
  'use strict';

  var url      = job.data.url,
      cacheKey = crypto.createHash('md5').update(url).digest('hex'),
      cache;

  if ((cache = draftr.cache.get(cacheKey)) && cache.imported) {
    job.log('Article (url: ' + url + ') already known');
    return done();
  }

  Article.findOne({ url: job.data.url }, function (err, entity) {
    if (err) {
      return done(err);
    }

    if (entity) {
      return done();
    }

    draftr.cache.set(cacheKey, {
      imported: true
    });

    readability(job.data.url, function (err, article) {
      function handleError(err) {
        article.close();
        done(err);
      }

      if (err) {
        return handleError(err);
      }

      if (entity) {
        article.close();
        return done();
      }

      Article.create(
        {
          url: job.data.url,
          title: article.title,
          body: article.content
        },
        function (err, data) {
          if (err) {
            return handleError(err);
          }

          Feed.findOneAndUpdate(
            { _id: job.data.feedId },
            {
              $push: { articles: data.id }
            },
            function(err, result) {
              if (err) {
                return handleError(err);
              }

              return done();
            }
          );
          article.close();
          done();
        }
      );
    });
  });
};