const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref:"File",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
