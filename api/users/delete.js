module.exports = ({ router, User, verify }) => {
  router.delete('/:cardNumber', async (req, res) => {
    const idTokenString = req.token;
    const payload = await verify(idTokenString);
    const cardNumber = req.params.cardNumber;    

    if (payload && payload.hd === 'esm.co.jp') {
      await User.delete(cardNumber)
      .then((response) => {
        res.json(response);
      })
      .catch(err => {
        console.log('ERROR', err);
        res.status(500).json(err);
      });

    } else {
      res.sendStatus(403);
    }
  });
};
