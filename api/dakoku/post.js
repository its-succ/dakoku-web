const validate = require('express-validation');
const Joi = require('joi');
const dakokuRequest = require('./dakoku-request');

module.exports = ({router, User}) => {
  const validation = {
    headers: {
      'x-appengine-queuename': Joi.string().required()
    },
    body: {
      cardNumber: Joi.string().regex(/^[0-9]{16}$/).required()
    }
  };

  router.post('/', validate(validation), async (req, res) => {
    const cardNumber = req.body.cardNumber;
    const entity = await User.get(cardNumber).catch(err => {
      console.error('Cardnumber find error', err);
      res.status(204).send();
    });
    const user = entity.plain({ virtuals: true });
    await dakokuRequest({email: user.email, password: user.decryptPassword});
    res.status(202).send();
  });
};
