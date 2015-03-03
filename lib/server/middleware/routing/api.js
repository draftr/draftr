var express  = require('express'),
    bind     = require('./bind'),
    passport = require('passport'),
    router   = express.Router();

router.del = router['delete'];

router.all('*', passport.authenticate('bearer', { session: false }));
router.get('/me', bind('api/me/read'));

module.exports = router;