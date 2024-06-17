const express = require("express");
const { updateProfile } = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.patch("/updateUser", updateProfile);

module.exports = {
  userRouter,
};
