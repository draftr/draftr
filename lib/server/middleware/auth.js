var passport        = require('passport'),
    BearerStrategy  = require('passport-http-bearer'),
    jwt             = require('jsonwebtoken'),
    crypto          = require('crypto'),
    ValidationError = require('../error/validation-error'),
    StatusError     = require('../error/status-error'),
    Token           = require('../model/token'),
    User            = require('../model/user'),
    draftr          = require('../draftr'),
    internalError   = new StatusError(500, 'Something went wrong');

module.exports = function auth(app) {
  'use strict';

  app.use(passport.initialize());

  app.post(
    '/api/sign-out',
    function (req, res) {
      var token = req.body.accessToken;

      Token.remove({ token: token }, function (err) {
        if (err) {
          return res.api(new StatusError(500, 'Internal Server Error'));
        }

        res.api(200, null, null);
      });
    }
  );

  app.post(
    '/api/sign-in',
    function (req, res) {
      req.checkBody('username').notEmpty();
      req.checkBody('password').notEmpty();

      var errors = req.validationErrors(),
          query;

      if (errors) {
        return res.api(new ValidationError(400, 'Invalid data', errors));
      }

      query = {
        username: ('' + req.body.username).trim(),
        password: crypto.createHash('sha1').update(('' + req.body.password).trim()).digest('hex')
      };

      User.findOne(query, function (err, user) {
        if (err) {
          return res.api(internalError);
        }

        if (!user) {
          return res.api(new StatusError(404, 'Invalid credentials'));
        }

        Token.findOne({ user: user._id }, function (err, entity) {
          var generatedAccessToken = jwt.sign([user._id, Math.random() * 100000].join('-'), draftr.config.token.secret);

          if (entity) {
            entity.token = generatedAccessToken;
            entity.save(function (err, token) {
              if (err) {
                return res.api(internalError);
              }

              res.api(200, null, { accessToken: token.token });
            });
          } else {
            (new Token({ token: generatedAccessToken, user: user._id })).save(function (err, token) {
              if (err) {
                return res.api(internalError);
              }

              res.api(200, null, { accessToken: token.token });
            });
          }
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