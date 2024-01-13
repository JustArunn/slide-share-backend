const { AsyncHandler } = require("../utils/AsyncHandler");
const { verifyAuthToken } = require("../utils/jwt");

const auth = AsyncHandler((req, res, next) => {
  const token = req.headers["x-auth-token"] || req.cookies.token;
  const user = verifyAuthToken(token);
  if (user) {
    req.user = user;
    next();
  }
});

module.exports = { auth };
