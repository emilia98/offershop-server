const passport = require('passport');
const LocalPassport = require('passport-local');
const User = require('mongoose').model('User');

module.exports = () => {
  passport.use(new LocalPassport(async (username, password, done) => {
    let user = await User.findOne({ username: username });

    if (!user) {
      return done(null, false);
    }

    if (!user.checkPassword(password)) {
      return done(null, false);
    }

    return done(null, user);
  }));

  passport.serializeUser((user, done) => {
    if (user) {
      return done(null, user._id);
    }
    return done(null, false);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await User.findById(id);

    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  });
};
