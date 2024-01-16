const router = require("express").Router();
const { auth } = require("../middleware/auth.middleware.js");
const { upload } = require("../middleware/multer.middleware.js");
const {
  signup,
  login,
  profile,
  logout,
} = require("../controllers/user.controllers.js");

router.post("/signup", upload.single("avatar"), signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", auth, profile);

//import file controllers
const {
  uploadFile,
  updateFile,
  deleteFile,
  likeFile,
  likedFiles,
} = require("../controllers/file.contollers.js");

//file routes
router.post("/upload-file", auth, upload.single("file"), uploadFile);
router.post("/update-file/:id", auth, updateFile);
router.post("/delete-file/:id", auth, deleteFile);
router.post("/like-file/:id", auth, likeFile);
router.get("/liked-file/", auth, likedFiles);

//import home page controllers
const {
  feed,
  search,
  searchByCategory,
} = require("../controllers/feed.controllers.js");

// home page routes
router.get("/feed", feed);
router.get("/search/:query", search);
router.get("/category/:query", searchByCategory);

module.exports = {
  router,
};
