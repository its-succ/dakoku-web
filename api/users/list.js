module.exports = ({router, User, verify}) => {
  router.get('/', async (req, res) => {
    const idTokenString = req.token;
    const payload = await verify(idTokenString);
    if (payload && payload.hd ==='esm.co.jp' ) {
      const user = new User({
        email: payload.email
      });

      // 1. Build query.
      const query = User.query().filter('email', '=', user.email);

      // 2. Execute the query.
      // with Promise
      const results = await query.run().then((response) => {
          return response.entities;
      });

      res.status(200).json(results.map(r => r.id).sort());

    } else {
      res.sendStatus(403);
    }
  });
};
