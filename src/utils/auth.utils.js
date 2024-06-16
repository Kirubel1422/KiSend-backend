const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const genToken = (userId) => {
  return jwt.sign({ id: userId }, SECRET, { expiresIn: "2d" });
};

module.exports = {
  genToken,
};
