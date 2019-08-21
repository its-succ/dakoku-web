module.exports = ({ router, User, verify }) => {
  router.delete('/', async (req, res) => {
    const idTokenString = req.token;
    const payload = await verify(idTokenString);
    if (payload && payload.hd === 'esm.co.jp') {
      const user = new User({
        email: payload.email
      }, req.body.cardNumber.toLocaleLowerCase());
      const cardNumber = req.body.cardNumber.toLocaleLowerCase();
      user.delete(cardNumber)
        .then((response) => {
          res.json(response);
        })
        .catch(err => res.status(400).json(err));

    } else {
      res.sendStatus(403);
    }
  });
};
