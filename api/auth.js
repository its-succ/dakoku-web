const router = require('express-promise-router')();

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const verify = async token => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });
  return ticket.getPayload();
};

router.post('/', async (req, res) => {
  const idTokenString = req.body.idToken;
  const payload = await verify(idTokenString);
  if (!payload) {
    res.sendStatus(400);
  } else {
    const domain = payload.hd;
    if ("esm.co.jp" != domain) {
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  }
})

module.exports = router;
