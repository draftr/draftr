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

router.post('/article',requireAuthentication, bind('api/article/create'));
router.get('/article/:id',requireAuthentication, bind('api/article/read'));
router.post('/article/:id', requireAuthentication, bind('api/article/update'));
router.del('/article/:id',  requireAuthentication, bind('api/article/delete'));

router.post('/feed',requireAuthentication, bind('api/feed/create'));
router.get('/feed/:id',requireAuthentication, bind('api/feed/read'));
router.post('/feed/:id', requireAuthentication, bind('api/feed/update'));
router.del('/feed/:id',  requireAuthentication, bind('api/feed/delete'));
module.exports = router;