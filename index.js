require("dotenv").config({ path: "./.env" });
const { app } = require("./app");
const { connectDB } = require("./config/db");

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error", err);
  });
