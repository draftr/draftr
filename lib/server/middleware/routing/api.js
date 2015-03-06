var express  = require('express'),
    bind     = require('./bind'),
    passport = require('passport'),
    router   = express.Router();

router.del = router['delete'];

router.all('*', passport.authenticate('bearer', { session: false }));
router.get('/me', bind('api/me/read'));

router.post('/user', bind('api/user/create'));
router.get('/user/:id?', bind('api/user/read'));
router.post('/user/:id', bind('api/user/update'));
router.del('/user/:id', bind('api/user/delete'));

module.exports = router;