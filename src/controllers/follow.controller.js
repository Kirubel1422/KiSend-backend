const Followings = require("../models/follows"); // My followings
const Users = require("../models/User"); // All Users

exports.followUser = async (req, res) => {
  const { followedUserId } = req.params;
  const { id } = req.body;

  try {
    // Check if the user exists;
    const followedUser = await Users.findById(followedUserId).populate(
      "follows"
    );

    console.log(followedUser);

    // If the user doesn't exists, send error message
    if (!followedUser)
      return res.status(400).json({ message: "User doesn't exist" });

    // Check if the user is already on black list
    const isBlocked = followedUser.follows.find(
      (item) => item.status == "blocked"
    );

    if (isBlocked)
      return res.status(403).json({ message: "You are blocked by the user." });

    // Create a document on following schema
    const following = new Followings({
      firstName: followedUser.firstName,
      lastName: followedUser.lastName,
      followerId: id,
      followedId: followedUserId,
      status: "normal",
    });

    await following.save();

    res.status(201).json({ message: "Successfully followed user." });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.unFollowUser = async (req, res, next) => {
  const { unFollowUserId } = req.params;
  const { userId } = req.body;

  try {
    // Check if the user exists;
    const unFollowedUser = await Users.findById(unFollowUserId);

    // If the user doesn't exists, send error message
    if (!unFollowedUser)
      return res.status(400).json({ message: "User doesn't exist" });

    Followings.findOneAndDelete({
      followerId: userId,
      followedId: unFollowUserId,
    })
      .then((data) => {
        if (data.deletedCount > 0) {
          res.json({ messsage: "Successfully Deleted User" });
        } else {
          res.status(400).json({ message: "Something went wrong!" });
        }
      })
      .catch((err) => next(err));
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getAllFollowings = async (req, res) => {
  const { userId } = req.body;

  try {
    const followings = await Followings.find({ followerId: userId });
    res.send(followings);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.getFollowedById = async (req, res) => {
  const { followedId } = req.params;

  try {
    const followedUser = await Users.findById(followedId);

    if (!followedId)
      return res.status(400).json({ message: "User doesn't exist" });

    res.send(followedUser);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.blockUser = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.params;

  try {
    Followings.findOneAndUpdate(
      { followedId: id, followerId: userId },
      { status: "blocked" }
    )
      .then((data) => {
        if (data) {
          return res.status(200).json({ message: "Blocked Successfully" });
        } else {
          return res.status(400).json({ message: "Blocking error" });
        }
      })
      .catch((err) => next(err));
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.followBack = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    Followings.findOneAndUpdate(
      { followerId: id, followedId: userId },
      { status: "following" }
    )
      .then((data) => {
        if (data) {
          return res.json({ message: "Followed back successfully!" });
        } else {
          return res.json({ message: "Follow back error" });
        }
      })
      .catch((err) => next(err));
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllFollowers = async (req, res, next) => {
  const { id } = req.body;

  try {
    const followers = await Followings.find({ followedUser: id });

    return res.send(followers);
  } catch (error) {
    console.log(error);
  }
};
