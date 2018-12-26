const router = require('express-promise-router')();
const verify = require('./token-verifier');
const User = require('../model/user');

router.post('/', async (req, res) => {
  const idTokenString = req.token;
  const payload = await verify(idTokenString);
  if (payload && payload.hd ==='esm.co.jp' ) {
    const user = new User({
      idm: req.body.cardNumber,
      email: payload.email,
      password: req.body.password
    });

    const entity = await user.save().catch(err => {
      console.log('ERROR', err);
      res.status(400).json(err);
    });
    res.status(201).json(entity.plain());

  } else {
    res.sendStatus(400);
  }
})

module.exports = router;
