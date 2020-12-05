const jwt = require('jsonwebtoken');
const bearerToken = require("express-bearer-token");
const { secret, expiresIn } = require('./config').jwtConfig;
const { User } = require('./db/models');

const getUserToken = (user) => {

  const userData = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(
    { data: userData },
    secret,
    { expiresIn: parseInt(expiresIn, 10) }
  );

  return token;
};

const verifyUser = (req, res, next) => {
  const token = req.body.access_token
  if(!token) return res.sendStatus(401)

  jwt.verify(token, secret, (err, jwtPayload) => {
    if(err) return res.sendStatus(403)

    req.user = jwtPayload
    next()
  })
}

module.exports = { getUserToken, verifyUser, }
