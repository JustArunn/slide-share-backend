const express = require("express");
const router = new express.Router();

const { upload } = require("../middleware/multer.middleware.js");
const { auth } = require("../middleware/auth.middleware.js");
const {
  login,
  signup,
  profile,
  logout,
  update,
  _delete,
} = require("../controllers/user.controllers.js");

router.post("/signup", upload.single("avatar"), signup);
router.post("/login", login);
router.patch("/profile", auth, profile);
router.put("/update", auth, update);
router.delete("/delete", auth, _delete);
router.delete("/logout", logout);

module.exports = router;

// http://localhost:4000/user/signup - POST
// http://localhost:4000/user/login  - POST
// http://localhost:4000/user/profile- PATCH
// http://localhost:4000/user/update - UPDATE
// http://localhost:4000/user/delete - DELETE
// http://localhost:4000/user/logout - DELETE