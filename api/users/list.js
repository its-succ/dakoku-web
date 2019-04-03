const validate = require('express-validation');
const Joi = require('joi');
const grpc = require('grpc');

module.exports = ({router, User, verify}) => {
  router.get('/', async (req, res) => {
    const idTokenString = req.token;
    const payload = await verify(idTokenString);
    if (payload && payload.hd ==='esm.co.jp' ) {
      const user = new User({
        email: payload.email
      });

      // gstore-nodeで書いてみる TODO まだ書いただけ
      const query = User.query().filter('id', '=', user.email);

      // 2. Execute the query.
      // with Promise
      query.run().then((response) => {
          const entities = response.entities;
          console.log("entities", entities)
      });

      // 固定文字で返してみる TDD
      const results = ['1234567890123456', '987654321012345'];
      res.status(200).json(results);

    } else {
      res.sendStatus(403);
    }
  });
};
