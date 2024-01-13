const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("./public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//routes imports
const { userRouter } = require("./routes/user.routes.js");

//routes init
app.use("/api/v1/user", userRouter);

module.exports = {
  app,
};
