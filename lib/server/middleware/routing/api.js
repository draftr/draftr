'use strict';

var express               = require('express'),
    bind                  = require('./bind'),
    passport              = require('passport'),
    router                = express.Router(),
    requireAuthentication = passport.authenticate('bearer', { session: false });

router.del = router['delete'];

router.get('/me', requireAuthentication, bind('api/me/read'));

router.post('/user/register', bind('api/user/create'));

router.get('/user/:id?',      requireAuthentication, bind('api/user/read'));
router.post('/user/:id',      requireAuthentication, bind('api/user/update'));
router.del('/user/:id',       requireAuthentication, bind('api/user/delete'));

router.post('/article',     requireAuthentication, bind('api/article/create'));
router.get('/article/:id?', requireAuthentication, bind('api/article/read'));
router.post('/article/:id', requireAuthentication, bind('api/article/update'));
router.del('/article/:id',  requireAuthentication, bind('api/article/delete'));

router.post('/feed',     requireAuthentication, bind('api/feed/create'));
router.get('/feed/:id?', requireAuthentication, bind('api/feed/read'));
router.post('/feed/:id', requireAuthentication, bind('api/feed/update'));
router.del('/feed/:id',  requireAuthentication, bind('api/feed/delete'));

router.post('/work-space',     requireAuthentication, bind('api/work-space/create'));
router.get('/work-space/:id?', requireAuthentication, bind('api/work-space/read'));
router.post('/work-space/:id', requireAuthentication, bind('api/work-space/update'));
router.del('/work-space/:id',  requireAuthentication, bind('api/work-space/delete'));

router.post('/work-space/:id/user',         requireAuthentication, bind('api/work-space-user/create'));
router.get('/work-space/:id/user/:userId?', requireAuthentication, bind('api/work-space-user/read'));
router.post('/work-space/:id/user/:userId', requireAuthentication, bind('api/work-space-user/update'));
router.del('/work-space/:id/user/:userId',  requireAuthentication, bind('api/work-space-user/delete'));

router.post('/work-space/:id/article',            requireAuthentication, bind('api/work-space-article/create'));
router.get('/work-space/:id/article/:articleId?', requireAuthentication, bind('api/work-space-article/read'));
router.post('/work-space/:id/article/:articleId', requireAuthentication, bind('api/work-space-article/update'));
router.del('/work-space/:id/article/:articleId',  requireAuthentication, bind('api/work-space-article/delete'));

router.post('/work-space/:id/feed',         requireAuthentication, bind('api/work-space-feed/create'));
router.get('/work-space/:id/feed/:feedId?', requireAuthentication, bind('api/work-space-feed/read'));
router.del('/work-space/:id/feed/:feedId',  requireAuthentication, bind('api/work-space-feed/delete'));

module.exports = router;