const router = require('express-promise-router')();
const verify = require('./token-verifier');
const User = require('../model/user');

const create = require('./users/create');
const list = require('./users/list');
const deleteCard = require('./users/delete');

create({router, User, verify});
list({router, User, verify});
deleteCard({router, User, verify});

module.exports = router;
