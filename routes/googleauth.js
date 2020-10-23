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
      res.cookie('jwt', token);
      res.cookie('user', user);
      // console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$44');
      // console.log(user);
      // console.log(token);
      return res.redirect('/');
    });
  }
);

module.exports = router;
