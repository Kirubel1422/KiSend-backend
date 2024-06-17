const Users = require("../models/User");
const path = require("path");
const crypto = require("crypto");

exports.updateProfile = async (req, res) => {
  // Parse request body
  const { city, country, birthDate, phone, id } = req.body;
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
      profilePicture.mv(
        path.resolve(__dirname, "../../public/images/" + tempFileName)
      );

      // Rename for letter fetching
      pictureName = `/getImage/${tempFileName}`;
    }

    const updated = await user.updateOne(
      {
        profilePicture: pictureName,
        city,
        country,
        birthDate,
        phone,
      },
      { new: true }
    );

    // Return the updated user
    return res.json({ user, updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
