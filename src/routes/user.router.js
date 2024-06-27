const express = require("express");
const {
  updateProfile,
  getGlobalUsers,
  addFriend,
} = require("../controllers/user.controller");
const authorize = require("../middlewares/auth.middleware");
const router = express.Router();

router.route("/updateProfile").patch(authorize, updateProfile);
router.route("/addFriend/:userId").patch(authorize, addFriend);
router.route("/getGlobalUsers").get(getGlobalUsers);

module.exports = router;
