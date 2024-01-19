const { ApiError } = require("../utils/ApiError");
const { AsyncHandler } = require("../utils/AsyncHandler");
const User = require("../models/user.model.js");
const File = require("../models/file.model.js");
const { uploadToCloudinary } = require("../config/cloudinary.js");
const { ApiResponse } = require("../utils/ApiResponese.js");
const fs = require("fs");

const signup = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(401).json(new ApiError(400, "All fields are required"));
  }
  const exUser = await User.findOne({ email: email });

  if (exUser) {
    fs.unlinkSync(req.file.path);
    return res
      .status(401)
      .json(new ApiError(401, "User already exists with this email"));
  }

  const localFilePath = req.file?.path;
  const avatar = await uploadToCloudinary(localFilePath);
  if (!avatar) {
    return res.json(new ApiError(402, "Avatar is required"));
  }

  const user = await User({
    name: name,
    email: email,
    password: password,
    avatar: avatar.secure_url,
  }).save();
  const token = user.generateAuthToken();

  const response = res
    .status(201)
    .setHeader("x-auth-token", token)
    .cookie("token", token, { httpOnly: true })
    .json(new ApiResponse("User created", user));
  return response;
});

const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }
  const user = await User.findOne({ email: email }).select(
    "name email password avatar files likedFiles"
  );
  if (!user) {
    return res.status(404).json(new ApiError(404, "User does not exits"));
  }

  if (user.password !== password) {
    return res.status(400).json(new ApiError(400, "Invalid password"));
  }

  user.password = undefined;
  const token = user.generateAuthToken();
  return res
    .status(200)
    .setHeader("x-auth-token", token)
    .cookie("token", token, { httpOnly: true })
    .json(new ApiResponse("User LoggedIn", user));
});

const update = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { name: name, email: email, password: password },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse("user upated successfully", user));
});

const _delete = AsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  await File.deleteMany({
    _id: {
      $in: [...user.files],
    },
  });
  await user.deleteOne();

  if (!user) {
    return res.status(404).json(new ApiError(404, "user does not exists"));
  }
  return res.status(200).json(new ApiResponse("user deleted Successfully"));
});

const profile = AsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email })
    .select("name email avatar files likedFiles")
    .populate(["files", "likedFiles"])
    .exec();
  return res.status(200).json(new ApiResponse("Profile fatched", user));
});

const logout = AsyncHandler((req, res) => {
  const token = req.headers["x-auth-token"] || req.cookies.token;
  if (!token) {
    return res.status(404).json(new ApiError(404, "Your are not loggedIn.."));
  }
  return res
    .status(200)
    .setHeader("x-auth-header", null)
    .clearCookie("token")
    .json(new ApiResponse("Logged out..."));
});

module.exports = {
  signup,
  login,
  profile,
  logout,
  update,
  _delete,
};
