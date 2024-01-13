const { ApiError } = require("../utils/ApiError");
const { AsyncHandler } = require("../utils/AsyncHandler");
const User = require("../models/user.model.js");
const { uploadToCloudinary } = require("../config/cloudinary.js");
const { ApiResponse } = require("../utils/ApiResponese.js");
const { generateAuthToken, getAuthToken } = require("../utils/jwt.js");

const signup = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(401).json(new ApiError(400, "All fields are required"));
  }
  const exUser = await User.findOne({ email });
  if (exUser) {
    return res
      .status(401)
      .json(new ApiError(401, "User already exists with this email"));
  }
  const localFilePath = req.file?.path;
  const avatar = await uploadToCloudinary(localFilePath);
  if (!avatar) {
    return res.json(new ApiError(402, "Avatar is required"));
  }

  const userObject = {
    name,
    email,
    password,
    avatar: avatar?.secure_url,
  };
  const savedUser = await User(userObject).save();
  const userRes = {
    name: savedUser.name,
    email: savedUser.email,
    avatar: savedUser.avatar,
  };
  return res.status(201).json(new ApiResponse("User created", userRes));
});

const login = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }
  const user = await User.find({ email: email });
  if (!user) {
    return res.status(404).json(new ApiError(404, "User does not exits"));
  }
  if (!user.password == password) {
    return res.status(400).json(new ApiError(400, "Invalid password"));
  }
  user.password = undefined;
  user.__v = undefined;
  const token = generateAuthToken({...user});
  res.setHeader("x-auth-token", token);
  return res.status(200).json(new ApiResponse("User LoggedIn", user));
});

module.exports = {
  signup,
  login,
};
