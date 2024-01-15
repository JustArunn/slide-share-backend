const { ApiResponse } = require("../utils/ApiResponese");
const { AsyncHandler } = require("../utils/AsyncHandler");
const File = require("../models/file.model.js");

const feed = AsyncHandler(async (req, res) => {
  const feedRes = await File.find({}).limit(10);
  return res.status(200).json(new ApiResponse("Feed data", feedRes));
});

const search = AsyncHandler(async (req, res) => {
  const Category = await File.find({ category: req.params.query })
    .limit(15)
    .select("-createdAt -_id -__v");

  const Title = await File.find({ title: req.params.query })
    .limit(15)
    .select("-createdAt -_id -__v");
  return res
    .status(404)
    .json(new ApiResponse("search result", [...Category, ...Title]));
});

const searchByCategory = AsyncHandler(async (req, res) => {
  const searchByCategoryRes = await File.find({
    catagory: req.params.query,
  }).limit(15);
  return res
    .status(200)
    .json(new ApiResponse("fetched feed data..", searchByCategoryRes));
});

module.exports = {
  feed,
  search,
  searchByCategory,
};
