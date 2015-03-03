var express        = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    responseTime   = require('response-time'),
    validator      = require('express-validator'),
    hbs            = require('express-hbs'),
    auth           = require('./auth'),
    logger         = require('./logger');

module.exports  = function () {
  'use strict';

  var app = express();

  app.use('/queue', require('kue').app);

  app.use(responseTime());
  app.use(logger);

  app.response.api = require('../api/response');

  app.use(express.static(process.cwd() + '/public'));

  app.disable('x-powered-by');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(methodOverride('_method'));

  app.use(validator({
    errorFormatter: function(param, message, value) {
      var namespace = param.split('.'),
          root      = namespace.shift(),
          formParam = root;

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }

      return {
        param: formParam,
        message: message,
        value: value
      };
    },
    customValidators: {
      isValidId: function isValidId(value) {
        return /^[a-zA-Z0-9-]*$/.test(value);
      }
    }
  }));

  app.engine('hbs', hbs.express3({
    partialsDir: __dirname + '/../visual/partial',
    layoutsDir: __dirname + '/../visual/layout',
    contentHelperName: 'defineBlock'
  }));
  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/../visual');

  // auth
  auth(app);

  app.use('/api', require('./routing/api'));
  app.use('/', require('./routing/main'));

  return app;
};