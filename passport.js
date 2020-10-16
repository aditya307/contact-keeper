const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const GoogleUser = require('./models/GoogleUser');

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.GOOGLE_CLIENT_ID,
      clientSecret: keys.GOOGLE_CLIENT_SECRET,
      callbackURL: '/login/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        FirstName: profile.name.givenName,
        LastName: profile.name.familyName,
        email: profile.emails[0].value,
        image: profile.photos[0].value,
      };
      try {
        let user = await GoogleUser.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          user = await GoogleUser.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.error(err);
      }
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
