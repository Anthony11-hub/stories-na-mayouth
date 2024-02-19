const passport = require("passport");
const localStrategy = require("passport-local");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

passport.use(
  new localStrategy(
    { usernameField: "username" },
    async (username, password, done) => {
      try {
        let user = await User.findOne({ username: username });

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }

        // match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, { message: "Incorrect password." });
        });
      } catch (error) {
        done(null, error);
      }
    }
  )
);
