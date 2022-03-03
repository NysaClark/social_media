const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bio: { type: String, default: "no bio provided" },
    social: {
      youtube: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      facebook: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
