const passport = require("passport");

const authorize = async (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, id, info) => {
    if (err) return next(err);
    if (!id) return res.status(401).json({ message: "Unauthorized" });
    console.log(id);
    req.body.userId = id;
    next();
  })(req, res, next);
};

module.export = authorize;
