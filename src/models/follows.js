const { mongoose, Schema } = require("mongoose");

const FollowSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    followerId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: ["blocked", "following", "normal"],
      required: true,
    },
    followedId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        delete ret._id;
      },
      timestamps: true,
    },
  }
);

module.exports = mongoose.model("Follows", FollowSchema);
