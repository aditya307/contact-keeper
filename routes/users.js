const express = require('express');
const router = express.Router();
// const multer = require('multer');
const jwt = require('jsonwebtoken');
// const secretKey = 'secretKey';
const bcrypt = require('bcryptjs');
const { body, validationResult, check } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      err: 'Server Error',
    });
  }
});

router.post(
  '/',
  [
    check('name', 'Please enter name').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail().not().isEmpty(),
    check('password', 'Please enter password of min length 6').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, password } = req.body;

      var user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'user exists' });
      }

      user = new User({
        name,
        email,
        password,
      });

      const Salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, Salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, 'secretkey', (err, token) => {
        if (err) {
          throw err;
        }
        // res.json({ token });
        return res.status(200).json({
          success: true,
          data: user,
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
// upload AVATAR
// const upload = multer({
//   limits: {
//     fileSize: 1000000000,
//   },
// });

// router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
//   const { avatar } = req.body;
//   try {
//     const profile = User({ avatar });
//     await profile.save();

//     return res.status(200).json({
//       success: true,
//       data: profile,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(404).json({
//       success: false,
//       err: 'Server Error',
//     });
//   }
// });

module.exports = router;
