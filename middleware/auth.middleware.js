const { ApiError } = require("../utils/ApiError");
const { AsyncHandler } = require("../utils/AsyncHandler");
const jwt = require("jsonwebtoken");

const verifyAuthToken = (token) => {
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (err) {
    console.log("Erorr in verification of Auth-Token", err);
  }
};

const auth = AsyncHandler((req, res, next) => {
  const token = req.headers["x-auth-token"] || req.cookies.token;
  if(!token){
    return res.status(400).json(new ApiError(400, "Please LogIn.."))
  }
  const user = verifyAuthToken(token);
  if (user) {
    req.user = user;
    next();
  }
});

module.exports = { auth };
