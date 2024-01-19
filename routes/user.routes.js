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

router.post("/", upload.single("avatar"), signup);
router.get("/", login);
router.patch("/", auth, profile);
router.put("/", auth, update);
router.delete("/", auth, _delete);
router.delete("/logout", logout);

module.exports = router;
