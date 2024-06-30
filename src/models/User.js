const { mongoose, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    dateOfBirth: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    follows: [
      {
        type: Schema.Types.ObjectId,
        ref: "Follows",
      },
    ],
    role: {
      type: String,
      default: "User",
      enum: ["SuperAdmin", "Admin", "User"],
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", ""],
      default: "",
    },
    phone: {
      type: String,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
      },
      timestamps: true,
    },
  }
);

// For hashing password before saving
UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) next();

    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hashed = await bcrypt.hash(this.password, salt);
    // Replace the password
    this.password = hashed;
    next();
  } catch (error) {
    next(error);
  }
});

// For comparing password for login
UserSchema.statics.comparePassword = async function (password, user) {
  // match the users
  return await bcrypt.compare(password, user.password);
};

module.exports = mongoose.model("User", UserSchema);
