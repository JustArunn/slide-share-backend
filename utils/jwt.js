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
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    return data;
  } catch (err) {
    console.log("Erorr in verification of Auth-Token", err);
  }
};

module.exports = {
  generateAuthToken,
  verifyAuthToken,
};
