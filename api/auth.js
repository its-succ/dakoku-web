const router = require('express-promise-router')();
const verify = require('./token-verifier');

router.post('/', async (req, res) => {
  const idTokenString = req.token;
  const payload = await verify(idTokenString);
  if (!payload) {
    res.sendStatus(400);
  } else {
    const domain = payload.hd;
    if ("esm.co.jp" != domain) {
      res.sendStatus(403);
    } else {
      res.sendStatus(200);
    }
  }
})

module.exports = router;
