const express = require("express");
const bcrypt = require("bcryptjs");
const { User, image } = require("../db/models");
const { asyncHandler } = require('../utils');
const { getUserToken, verifyUser } = require('../auth');
const bearerToken = require("express-bearer-token");
const { secret, expiresIn } = require('../config').jwtConfig;
const jwt = require('jsonwebtoken');
const multer = require('multer');

const upload = multer({dest: 'uploads/'});
const router = express.Router();

router.post('/token', asyncHandler(async(req, res) => {

  const {email, password} = req.body;
  const user = await User.findOne({
    where: {
      email
    }
  })
  if(user) {
    const dbPassword = user.dataValues.hashedPassword
    bcrypt.compare(password, dbPassword.toString(), (err, isMatch) => {
      if(err) {
        throw err
      } else if (!isMatch) {
        const err = Error
        err.status = 401,
        err.message = 'incorect password'
        res.json(err)
      } else {
        const token = getUserToken(user)
        res.cookie("access_token", token, { httpOnly: false });
        res.json({ token, user: { id: user.id, userName: user.username, firstName: user.first_name, lastName: user.last_name } });
      }
    })
  }
}))

// const verifyUser = (req, res, next) => {
//   const token = req.body.access_token
//   if(!token) return res.sendStatus(401)

//   jwt.verify(token, secret, (err, jwtPayload) => {
//     if(err) return res.sendStatus(403)

//     req.user = jwtPayload
//     next()
//   })

// }
router.post('/authenticate', verifyUser, asyncHandler(async(req, res) => {
  const user = await User.findByPk(req.user.data.id)
  const userData = {
    id: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name
  }
  res.json(userData)
}))



module.exports = router
