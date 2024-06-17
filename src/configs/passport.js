const User = require("../models/User");
const { validateCredential } = require("../utils/validator");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;

module.exports = (passport) => {
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.SECRET,
        passReqToCallback: true,
      },
      (payload, done) => {
        User.findOne({ _id: payload.id }, (err, user) => {
          if (err) return done(null, false);
          if (!user) return done(null, false);
          return done(null, payload.id);
        });
      }
    )
  );

  // For local strategy - signup
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // For getting the whole request body
      },
      async (req, email, password, done) => {
        // Check if the user already exits
        const userExists = await User.findOne({ email });
        if (userExists)
          return done(null, false, { message: "Email already in use." });

        // Validation
        const validate = validateCredential(email, password);
        if (!validate.valid)
          return done(null, false, { message: validate.message });

        // User object to be saved to db
        const { firstName, lastName } = req.body;
        const userObject = {
          firstName,
          lastName,
          password,
          email,
        };

        // Create user
        const user = new User(userObject);
        await user.save();

        done(null, user);
      }
    )
  );

  // For local-strategy - login
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        const user = await User.findOne({ email });
        // Check for user existence
        if (!user)
          return done(null, false, { message: "Invalid email or password" });

        // Compare the two passwords
        const passMatches = await User.comparePassword(password, user);

        // Return if password does not match
        if (!passMatches)
          return done(null, false, { message: "Invalid email or password." });

        return done(null, user);
      }
    )
  );
};
