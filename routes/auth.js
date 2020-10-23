const express = require('express');
const { body, validationResult, check } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const GUser = require('../models/GoogleUser');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let user = {};
    user = await User.findById(req.user.id);
    // console.log('MAIN ROUTE USER ^^^^^^^^^^^^^^^^^^^^^^^^^^^6');
    // console.log(user);
    // console.log(user === null);
    if (user === null) {
      user = await GUser.findById(req.user._id);
      console.log(user);
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      success: false,
      err: 'Server Error',
    });
  }
});

router.post(
  '/',
  [
    check('email', 'Please enter valid email id').isEmail(),
    check('password', 'Please enter the password').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });

      if (!user) {
        res.status(404).json({ msg: 'invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(404).json({
          msg: 'invalid Credentials',
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, 'secretkey', (err, token) => {
        if (err) {
          throw err;
        }
        res.json({
          success: true,
          token: token,
        });
      });
    } catch (err) {
      console.log(err);
      return res.status(404).json({
        success: false,
        err: 'Server Error',
      });
    }
  }
);

module.exports = router;
