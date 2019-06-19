const router = require('express-promise-router')();
const verify = require('./token-verifier');
const User = require('../model/user');

const create = require('./users/create');
const list = require('./users/list');

create({router, User, verify});
list({router, User, verify});

module.exports = router;
