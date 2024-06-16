const User = require("../models/User");
const passport = require("passport");
const { genToken } = require("../utils/auth.utils");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // Check if password and email exist in req.body
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required." });

  try {
    passport.authenticate(
      "local-login",
      {
        successRedirect: "/profile",
      },
      (err, user, info) => {
        if (err) next(err); // If server-error,

        if (!user) return res.status(401).json(info); // If custom error,

        return res.json({ token: genToken(user._id), user });
      }
    )(req, res, next);
  } catch (error) {
    console.log("SignUp", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.signUp = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    // Use passport
    passport.authenticate(
      "local-signup",
      { successRedirect: "/login" },
      (err, user, info) => {
        // If error,
        if (err) next(err);

        // If user is created,
        if (user) return res.send({ message: "Successfuly registered" });

        // If custom error,
        return res.status(401).json(info);
      }
    )(req, res, next);
  } catch (error) {
    console.log("SignUp", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
