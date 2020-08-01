const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user.model');

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: false
}, async (username, password, done) => {
  const user = await User.findOne({ username: username });

  return user ? user.verifyPassword(password) ? done(null, user)
                                              : done(null, false, { msg: 'Wrong password.' })
              : done(null, false, { msg: 'Username is not registered.' });
}));
