const express = require("express");
const { login, signUp } = require("../controllers/auth.controller");
const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signUp);

module.exports = {
  authRouter,
};
