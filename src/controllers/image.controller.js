const path = require("path");

exports.getImage = async (req, res) => {
  // Destructure params
  const { fileName } = req.params;

  // If file name does not exists, respond error.
  if (!fileName) return res.status(400).json({ message: "Picture not found" });

  // Get the file from public/images
  const profilePicture = path.resolve(
    __dirname,
    "../../public/images/" + fileName
  );

  // Send profile picture
  res.sendFile(profilePicture);
};
