const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected : HOST -> ", res.connection.host);
  } catch (err) {
    console.log("MongoDB connection Error : ", err);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
};
