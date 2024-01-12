const { signup } = require("../controllers/user.controllers.js");
const { upload } = require("../middleware/multer.middleware.js");
const userRouter = require("express").Router();

userRouter.post("/signup", upload.single("avatar"), signup);

module.exports = {
  userRouter,
};
