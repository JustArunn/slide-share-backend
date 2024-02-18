const express = require("express");
const router = new express.Router();

const {
  feed,
  search,
  searchByCategory,
} = require("../controllers/feed.controllers.js");

router.get("/", feed);
router.get("/search/:query", search);
router.get("/category/:query", searchByCategory);

module.exports = router;

// http://localhost:4000/ - GET
// http://localhost:4000/search/:query - GET
// http://localhost:4000/category/:query - GET