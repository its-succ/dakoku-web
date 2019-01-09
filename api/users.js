const router = require('express-promise-router')();
const verify = require('./token-verifier');
const User = require('../model/user');

const create = require('./users/create');

create({router, User, verify});

module.exports = router;
