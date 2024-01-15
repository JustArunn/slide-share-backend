const {
  signup,
  login,
  profile,
} = require("../controllers/user.controllers.js");
const { auth } = require("../middleware/auth.middleware.js");
const { upload } = require("../middleware/multer.middleware.js");
const router = require("express").Router();

router.post("/signup", upload.single("avatar"), signup);
router.post("/login", login);
router.get("/profile", auth, profile);

//import file controllers
const {
  uploadFile,
  updateFile,
  deleteFile,
  likeFile,
} = require("../controllers/file.contollers.js");

//file routes
router.post("/upload-file", auth, upload.single("file"), uploadFile);
router.post("/update-file/:id", auth, updateFile);
router.post("/delete-file/:id", auth, deleteFile);
router.post("/like-file/:id", auth, likeFile);

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
