const express = require("express");
const router = new express.Router();
const { auth } = require("../middleware/auth.middleware.js");
const { upload } = require("../middleware/multer.middleware.js");

const {
  uploadFile,
  deleteFile,
  updateFile,
  likeFile,
  likedFiles,
} = require("../controllers/file.contollers.js");

router.post("/", auth, upload.single("file"), uploadFile);
router.put("/:id", auth, updateFile);
router.patch("/:id", auth, likeFile);
router.get("/", auth, likedFiles);
router.delete("/:id", auth, deleteFile);

module.exports = router;
