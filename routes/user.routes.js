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
} = require("../controllers/file.contollers.js");

//file routes
router.post("/upload-file", auth,upload.single("file"), uploadFile);
router.post("/update-file", auth, updateFile);
router.post("/delete-file", auth, deleteFile);

module.exports = {
  router,
};
