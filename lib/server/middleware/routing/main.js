/*jslint node: true */
'use strict';

var express = require('express'),
    router  = express.Router(),
    bind    = require('./bind');

router.get('*', bind('main/index'));

module.exports = router;