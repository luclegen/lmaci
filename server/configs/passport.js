const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user.model');

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: false
}, (username, password, done) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) return done(err);
    // Unknown user
    else if (!user) return done(null, false, { message: 'Username is not registered.' })
    // Wrong password
    else if (!user.verifyPassword(password)) return done(null, false, { message: 'Wrong password.' });
    // Authentication successed
    else return done(null, user);
  });
}));