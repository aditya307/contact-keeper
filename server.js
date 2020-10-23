const express = require('express');
const bodyPraser = require('body-parser');
const path = require('path');
require('dotenv').config();
const connectDB = require('./db');
const auth = require('./routes/auth');
const users = require('./routes/users');
const cookieParser = require('cookie-parser');
const contacts = require('./routes/contacts');
const googleauth = require('./routes/googleauth');
const fbauth = require('./routes/fbauth');
const passport = require('passport');

require('./passport');
connectDB();
const app = express();
app.use(bodyPraser.json());
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/contacts', contacts);
app.use('/login', googleauth);

//Serve static assets inn production

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server runnning on ${PORT}`);
});
