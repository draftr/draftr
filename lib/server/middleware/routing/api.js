'use strict';

var express               = require('express'),
    bind                  = require('./bind'),
    passport              = require('passport'),
    router                = express.Router(),
    requireAuthentication = passport.authenticate('bearer', { session: false });

router.del = router['delete'];

router.get('/me',        requireAuthentication, bind('api/me/read'));
router.post('/user',     requireAuthentication, bind('api/user/create'));
router.get('/user/:id?', requireAuthentication, bind('api/user/read'));
router.post('/user/:id', requireAuthentication, bind('api/user/update'));
router.del('/user/:id',  requireAuthentication, bind('api/user/delete'));

module.exports = router;