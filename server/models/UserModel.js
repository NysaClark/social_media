const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    profilePicURL: { type: String },
    newMessagePopup: {
      type: Boolean,
      default: true,
    },
    unreadMessage: {
      type: Boolean,
      default: true,
    },
    unreadNotification: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "root"],
      default: "user",
    },
    resetToken: { type: String },
    expireToken: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
