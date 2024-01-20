const { AsyncHandler } = require("../utils/AsyncHandler");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../config/cloudinary");
const User = require("../models/user.model.js");
const File = require("../models/file.model.js");
const { ApiError } = require("../utils/ApiError.js");
const { ApiResponse } = require("../utils/ApiResponese.js");

const uploadFile = AsyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const localFilePath = req.file?.path;

  if (!localFilePath) {
    return res.status(404).json(new ApiError(404, "localFilePath not found"));
  }
  const email = req.user.email;

  if (!localFilePath) {
    return res
      .status(400)
      .json(new ApiError(404, "LocalFilePath not found ! File upload failed"));
  }
  const cloudFile = await uploadToCloudinary(localFilePath);

  const file = File({
    title: title,
    description: description,
    author: req.user.id,
    category: category,
  });
  file.fileLink.url = cloudFile.secure_url;
  file.fileLink.public_id = cloudFile.public_id;
  await file.save();

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found.."));
  }
  user.files.push(file._id);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse("File uploaded succcessfully..", file));
});

const updateFile = AsyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  const file = await File.findOne({ _id: id });
  if (!file) {
    return res.status(404).json(new ApiError(404, "file does not exists"));
  }
  file.title = title;
  file.description = description;
  const updatedFile = await file.save();

  return res.status(200).json(new ApiResponse("File updated..", updatedFile));
});

const deleteFile = AsyncHandler(async (req, res) => {
  const { email } = req.user;
  const { id } = req.params;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }
  if (user.files.includes(id)) {
    const index = user.files.indexOf(id);
    if (index > -1) {
      user.files.splice(index, 1);
      await user.save();
    }
  }
  if (user.likedFiles.includes(id)) {
    const index = user.likedFiles.indexOf(id);
    user.likedFiles.splice(index, 1);
    await user.save();
  }
  const file = await File.findOne({ _id: id });
  if (!file) {
    return res.status(404).json(new ApiError(404, "File does not exists"));
  }
  const public_id = file.fileLink.public_id;
  await deleteFromCloudinary(public_id, "image");
  await file.deleteOne();
  return res.status(200).json(new ApiResponse("File deleted successully"));
});

const likeFile = AsyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  const file = await File.findOne({ _id: req.params.id });
  if (!file) {
    return res.status(404).json(new ApiError(404, "file does not exists"));
  }
  if (file.likes.includes(user._id)) {
    const index = file.likes.indexOf(user._id);
    file.likes.splice(index, 1);
    const index2 = user.likedFiles.indexOf(req.params.id);
    user.likedFiles.splice(index2, 1);
    await file.save();
    await user.save();
    return res.status(200).json(new ApiResponse("Unliked..."));
  }

  file.likes.push(user._id);
  user.likedFiles.push(req.params.id);
  await file.save();
  await user.save();
  return res.status(200).json(new ApiResponse("Liked..."));
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
