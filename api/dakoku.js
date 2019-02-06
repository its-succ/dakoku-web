const router = require('express-promise-router')();
const User = require('../model/user');
const post = require('./dakoku/post');

post({router, User});

module.exports = router;
