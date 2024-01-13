const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

const uploadToCloudinary = async (localFilePath) => {
  try {
    const cloudResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return cloudResponse;
  } catch (err) {
    console.log("Error in cloudinary : ", err);
  }
};

module.exports = {
  uploadToCloudinary,
};