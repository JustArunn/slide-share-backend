const jwt = require("jsonwebtoken");

const generateAuthToken = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
  } catch (err) {
    console.log("Error in Token generation -> ", err);
  }
};

const verifyAuthToken = (token) => {
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      throw new Error("Error in token verification ", err);
    }
    return data;
  });
};

module.exports = {
  generateAuthToken,
  verifyAuthToken,
};
