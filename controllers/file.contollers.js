const { AsyncHandler } = require("../utils/AsyncHandler");
const { uploadToCloudinary } = require("../config/cloudinary");
const User = require("../models/user.model.js");
const File = require("../models/file.model.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponese.js");
const fs = require("fs");

const uploadFile = AsyncHandler(async (req, res) => {
  let { title, description, category } = req.body;

  const localFilePath = req.file.path;
  const email = req.user.email;

  if (!localFilePath) {
    return res
      .status(400)
      .json(new ApiError(404, "LocalFilePath not found ! File upload failed"));
  }
  const cloudResponse = await uploadToCloudinary(localFilePath);
  if (!cloudResponse) {
    throw new ApiError(400, "File upload failed");
  }

  const fileModelRes = await File({
    title: title,
    description: description,
    author: req.user.id,
    fileLink: cloudResponse.secure_url,
    category: category,
  }).save();

  await User.findOneAndUpdate(
    { email: email },
    { $push: { files: fileModelRes._id } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse("File uploaded succcessfully", fileModelRes));
});
const updateFile = AsyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  const fileRes = await File.findOneAndUpdate(
    { _id: id },
    { $set: { title: title, description: description } },
    { new: true }
  );
  return res.status(200).json(new ApiResponse("File updated", fileRes));
});
const deleteFile = AsyncHandler(async (req, res) => {
  const { email } = req.user;
  const { id } = req.params;

  await User.findOneAndUpdate(
    { email: email },
    { $pull: { files: id } },
    { new: true }
  );
  const fileRes = await File.findOneAndDelete({ _id: id });
  if (fileRes == null) {
    return res.status(404).json(new ApiError(404, "File does not exists"));
  }
  return res
    .status(200)
    .json(new ApiResponse("File deleted successully", fileRes));
});

const likeFile = AsyncHandler(async (req, res) => {
  const userRes = await User.findOne({ email: req.user.email });
  const fileRes = await File.findOne({ _id: req.params.id });
  if (fileRes.likes.includes(userRes._id)) {
    const unlikedFileRes = await File.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { likes: userRes._id } },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse("Unliked...", { unlikedFileRes, userId: userRes._id })
      );
  }
  const likedFileRes = await File.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { likes: userRes._id } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse("Liked...", { likedFileRes, userId: userRes._id }));
});

module.exports = {
  uploadFile,
  deleteFile,
  updateFile,
  likeFile,
};
