const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'no token, authentication denied' });
  }

  try {
    const decoded = jwt.verify(token, 'secretkey');

    req.user = decoded.user;
    // console.log(
    //   'auth middleware user %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5'
    // );
    // console.log(decoded.user);

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      err: 'Token not valid',
    });
  }
};
