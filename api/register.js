const router = require('express-promise-router')();
const validate = require('express-validation');
const Joi = require('joi');
const grpc = require('grpc');
const verify = require('./token-verifier');
const User = require('../model/user');

const validation = {
  body: {
    cardNumber: Joi.string().regex(/^[0-9]{16}$/).required(),
    password: Joi.string().required()
  }
};

router.post('/', validate(validation), async (req, res) => {
  const idTokenString = req.token;
  const payload = await verify(idTokenString);
  if (payload && payload.hd ==='esm.co.jp' ) {
    const user = new User({
      email: payload.email,
      password: req.body.password
    }, req.body.cardNumber);

    const entity = await user.save(null, { method: 'insert' }).catch(err => {
      console.log('ERROR', err);
      res.status(err.code === grpc.status.ALREADY_EXISTS ? 409 : 500).json(err);
    });
    res.status(201).json(entity.plain());

  } else {
    res.sendStatus(403);
  }
})

module.exports = router;
