const { signup, login, profile } = require("../controllers/user.controllers.js");
const { auth } = require("../middleware/auth.middleware.js");
const { upload } = require("../middleware/multer.middleware.js");
const userRouter = require("express").Router();

userRouter.post("/signup", upload.single("avatar"), signup);
userRouter.post("/login", login);
userRouter.get("/profile",auth, profile);

module.exports = {
  userRouter,
};
