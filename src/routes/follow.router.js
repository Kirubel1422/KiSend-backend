const express = require("express");
const router = express.Router();
const {
  followUser,
  unFollowUser,
  getAllFollowings,
  getFollowedById,
  blockUser,
  followBack,
} = require("../controllers/follow.controller");
const authorize = require("../middlewares/auth.middleware");

router.route("followUser").post(authorize, followUser);
router.route("unfollowUser/:unFollowUserId").patch(authorize, unFollowUser);
router.route("getAllFollowings").get(authorize, getAllFollowings);
router.route("getFollowedById/:followedId").get(authorize, getFollowedById);
router.route("blockUser/:id").patch(authorize, blockUser);
router.route("followBack/:id").patch(authorize, followBack);

module.exports = router;
