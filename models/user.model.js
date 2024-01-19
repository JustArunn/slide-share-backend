const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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
      index: true,
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
        ref: "File",
      },
    ],
    likedFiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  try {
    const payload = {
      name: this.name,
      email: this.email,
      id: this._id,
      avatar: this.avatar,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
  } catch (err) {
    console.log("Error in Token generation -> ", err);
  }
};

module.exports = mongoose.model("User", userSchema);
