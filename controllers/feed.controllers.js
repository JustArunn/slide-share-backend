const { ApiResponse } = require("../utils/ApiResponese");
const { AsyncHandler } = require("../utils/AsyncHandler");
const { ApiError } = require("../utils/ApiError.js");
const File = require("../models/file.model.js");

const feed = AsyncHandler(async (req, res) => {
  const feedData = await File.find({})
    .select("title description author createdAt fileLink")
    .limit(10);

  if (feedData.length < 1) {
    return res.status(404).json(new ApiError(`no data for feed`));
  }
  return res.status(200).json(new ApiResponse("Feed data", feedData));
});

const search = AsyncHandler(async (req, res) => {
  const searchByCategoryData = await File.find({ category: req.params.query })
    .limit(15)
    .select("title description author createdAt fileLink");

  const searchByTitleData = await File.find({ title: req.params.query })
    .select("title description author createdAt fileLink")
    .limit(15);
  if (searchByCategoryData.length < 1) {
    return res
      .status(404)
      .json(new ApiError(`result not found for : ${req.params.query}`));
  }
  return res
    .status(404)
    .json(
      new ApiResponse("search result", [
        ...searchByCategoryData,
        ...searchByTitleData,
      ])
    );
});

const searchByCategory = AsyncHandler(async (req, res) => {
  const search = await File.find().limit(50);
  if (search.length < 1) {
    return res
      .status(404)
      .json(new ApiError(`result not found for : ${req.params.query}`));
  }
  const filtered = search.filter((file) => file.category == req.params.query);
  if (filtered.length < 1) {
    return res
      .status(404)
      .json(new ApiError(`result not found for : ${req.params.query}`));
  }
  return res
    .status(200)
    .json(new ApiResponse("fetched category data..", filtered));
});

module.exports = {
  feed,
  search,
  searchByCategory,
};
