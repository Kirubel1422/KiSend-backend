const validator = require("validator");

// Returns validation status as boolean and comment
const validateCredential = (email, password) => {
  // Validate email
  if (!validator.isEmail(email))
    return { valid: false, message: "Invalid email." };

  // Validate password
  if (!validator.isStrongPassword(password))
    return { valid: false, message: "Weak password." };

  return { valid: true, message: null };
};

module.exports = { validateCredential };
