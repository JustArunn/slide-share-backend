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

router.post("/upload", auth, upload.single("file"), uploadFile);
router.put("/update/:id", auth, updateFile);
router.patch("/like/:id", auth, likeFile);
router.get("/liked", auth, likedFiles);
router.delete("/delete/:id", auth, deleteFile);

module.exports = router;

// http://localhost:4000/file/upload - POST
// http://localhost:4000/file/update/:id - PUT
// http://localhost:4000/file/like/:id - PATCH
// http://localhost:4000/file/liked - GET
// http://localhost:4000/file/delete/:id - DELETE