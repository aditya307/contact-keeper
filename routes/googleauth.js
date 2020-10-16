const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  // async (req, res) => {
  //   res.send('Google LOgged In');
  // },
  function (req, res) {
    const user = req.user;
    jwt.sign({ user: user }, 'secretkey', (err, token) => {
      if (err) {
        throw err;
      }
      // res.json({ token });
      // console.log(token);
      // return res.status(200).json({
      //   success: true,
      //   data: user,
      //   token: token,
      // });
      res.cookie('token', token);
      // res.redirect('/');
    });
  }
);

module.exports = router;
