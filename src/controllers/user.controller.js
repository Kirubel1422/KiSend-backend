const Users = require("../models/User");
const path = require("path");
const crypto = require("crypto");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  // Parse request body
  const { city, country, birthDate, phone, id, gender, firstName, lastName } =
    req.body;
  const { profilePicture } = req.files || {};
  try {
    const user = await Users.findById(id);

    // If user is not found, return error response
    if (!user) return res.status(400).json({ message: "Unauthorized" });

    // Check if profilePicture is also uploaded
    let pictureName = "";
    if (profilePicture) {
      // check the mimetype
      if (
        !path.extname(profilePicture.name).match(/\.(jpeg|jpg|png)$/i) ||
        !path.extname(profilePicture.name)
      ) {
        return res
          .status(400)
          .json({ message: "Invalid mime type for profile picture." });
      }

      // Assign random filename for the profile picture
      const tempFileName =
        crypto.randomUUID() + path.extname(profilePicture.name);

      // Move profile picture to public directory on images folder
      await profilePicture.mv(
        path.resolve(__dirname, "../../public/images/" + tempFileName)
      );

      // Rename for letter fetching
      pictureName = `/getImage/${tempFileName}`;
    }

    user.profilePicture = pictureName || user.profilePicture;
    user.city = city || user.city;
    user.country = country || user.country;
    user.dateOfBirth = birthDate || user.dateOfBirth;
    user.phone = phone || user.phone;
    user.gender = gender || user.gender;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    // Save update
    const savedUser = await user.save();
    console.log(savedUser);

    // Return the updated user
    return res.json({ user: savedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch single user
exports.getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (user == null)
      return res.status(400).json({
        message: "User not found",
      });

    res.json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        country: user.country,
        profilePicture: user.profilePicture,
        id: user.id,
        gender: user.gender,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

// Fetch all users
exports.getGlobalUsers = async (req, res) => {
  try {
    const users = await Users.find({}).populate("follows");

    // Filter necessary fields
    const filteredData = users.map((item) => {
      return {
        firstName: item.firstName,
        lastName: item.lastName,
        city: item.city,
        country: item.country,
        profilePicture: item.profilePicture,
        id: item.id,
        gender: item.gender,
        follows: item.follows,
      };
    });

    res.send({ users: filteredData });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};
