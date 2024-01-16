const { AsyncHandler } = require("../utils/AsyncHandler");
const { uploadToCloudinary } = require("../config/cloudinary");
const User = require("../models/user.model.js");
const File = require("../models/file.model.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponese.js");
const fs = require("fs");

const uploadFile = AsyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const localFilePath = req.file.path;
  const email = req.user.email;

  if (!localFilePath) {
    return res
      .status(400)
      .json(new ApiError(404, "LocalFilePath not found ! File upload failed"));
  }
  const cloudFile = await uploadToCloudinary(localFilePath);

  const file = await File({
    title: title,
    description: description,
    author: req.user.id,
    fileLink: cloudFile.secure_url,
    category: category,
  }).save();

  await User.findOneAndUpdate(
    { email: email },
    { $push: { files: file._id } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse("File uploaded succcessfully..", file));
});

const updateFile = AsyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  const file = await File.findOneAndUpdate(
    { _id: id },
    { $set: { title: title, description: description } },
    { new: true }
  );
  return res.status(200).json(new ApiResponse("File updated..", file));
});

const deleteFile = AsyncHandler(async (req, res) => {
  const { email } = req.user;
  const { id } = req.params;

  await User.findOneAndUpdate(
    { email: email },
    { $pull: { files: id } },
    { new: true }
  );
  const file = await File.findOneAndDelete({ _id: id });
  if (file == null) {
    return res.status(404).json(new ApiError(404, "File does not exists"));
  }
  return res
    .status(200)
    .json(new ApiResponse("File deleted successully", file));
});

const likeFile = AsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  const file = await File.findOne({ _id: req.params.id });

  if (file?.likes.includes(user._id)) {
    await File.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { likes: user._id } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { email: req.user.email },
      { $pull: { likedFiles: file._id } },
      { new: true }
    );
    return res.status(200).json(new ApiResponse("Unliked..."));
  }

  const likedFile = await File.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { likes: user._id } },
    { new: true }
  );

  await User.findOneAndUpdate(
    { email: req.user.email },
    { $push: { likedFiles: file._id } },
    { new: true }
  );

  return res.status(200).json(new ApiResponse("Liked...", likedFile));
});

const likedFiles = AsyncHandler(async (req, res) => {
  const { email } = req.user;
  const files = await User.findOne({ email: email })
    .select("likedFiles")
    .populate("likedFiles");
  return res.status(200).json(new ApiResponse("Liked Files...", files));
});

module.exports = {
  uploadFile,
  deleteFile,
  updateFile,
  likeFile,
  likedFiles,
};
