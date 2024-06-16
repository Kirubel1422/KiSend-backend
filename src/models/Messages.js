const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: function (ret, doc) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  }
);

module.exports = mongoose.model("Message", MessageSchema);
