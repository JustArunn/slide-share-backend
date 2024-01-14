const { AsyncHandler } = require("../utils/AsyncHandler");
const { uploadToCloudinary } = require("../config/cloudinary");
const User = require("../models/user.model.js");
const File = require("../models/file.model.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponese.js");
const fs = require("fs");

const uploadFile = AsyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const localFilePath = req.file.path;
  const email = req.user.email;

  if (!localFilePath) {
    return res.status(400).json(new ApiError(400, "File upload failed"));
  }
  const cloudResponse = await uploadToCloudinary(localFilePath);
  if (!cloudResponse) {
    fs.unlinkSync(localFilePath);
    throw new ApiError(400, "File upload failed");
  }

  const fileModelRes = await File({
    title: title,
    description: description,
    author: req.user.id,
    fileLink: cloudResponse.secure_url,
  }).save();

  const userModelRes = await User.findOneAndUpdate(
    { email: email },
    { $push: { files: fileModelRes._id } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse("File uploaded succcessfully", userModelRes));
});
const updateFile = AsyncHandler(async (req, res) => {});
const deleteFile = AsyncHandler(async (req, res) => {});
module.exports = {
  uploadFile,
  deleteFile,
  updateFile,
};
