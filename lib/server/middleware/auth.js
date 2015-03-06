var passport        = require('passport'),
    BearerStrategy  = require('passport-http-bearer'),
    jwt             = require('jsonwebtoken'),
    crypto          = require('crypto'),
    ValidationError = require('../error/validation-error'),
    StatusError     = require('../error/status-error'),
    Token           = require('../model/token'),
    User            = require('../model/user'),
    draftr          = require('../draftr'),
    util            = require('../util');

module.exports = function auth(app) {
  'use strict';

  app.use(passport.initialize());

  app.post(
    '/auth/signin',
    function (req, res) {
      req.checkBody('nickname').notEmpty();
      req.checkBody('password').notEmpty();

      var errors = req.validationErrors(),
          query;

      if (errors) {
        return res.api(new ValidationError(400, 'Invalid data', errors));
      }

      query = {
        nickname: ('' + req.body.nickname).trim(),
        password: crypto.createHash('sha1').update(('' + req.body.password).trim()).digest('hex')
      };

      User.findOne(query, function (err, result) {
        if (err) {
          return res.api(new StatusError(500, 'Something went wrong'));
        }

        if (!result) {
          return res.api(new StatusError(404, 'Cannot find user by credentials'));
        }

        var token = jwt.sign([result._id, Math.random() * 100000].join('-'), draftr.config.token.secret);

        (new Token({ token: token, user: result._id })).save(function (err, tank) {
          if (err) {
            if (util.detectMongoDbDuplicationErrorKey(err)) {
              return Token.findOne({ user: result._id }, function (err, entity) {
                if (err) {
                  return res.api(new StatusError(500, 'Something went wrong'));
                }

                res.api(200, null, {
                  token: entity.token
                });
              });
            }

            return res.api(new StatusError(500, 'Something went wrong'));
          }

          res.api(200, null, tank.toResObject());
        });
      });
    }
  );

  passport.use(new BearerStrategy(function(token, done) {
    Token
      .findOne({ token: token })
      .populate('user')
      .exec(function (err, entity) {
        if (err) {
          return done(err);
        }

        if (!entity) {
          return done(null, false);
        }

        return done(null, entity.user, { scope: 'all' });
      })
    ;
  }));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.find({ id: id }, function (err, user){
      if (err) {
        return done(err, false);
      }

      done(null, user);
    });
  });
};