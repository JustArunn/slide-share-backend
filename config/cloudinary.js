const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

const uploadToCloudinary = async (localFilePath, resource_type) => {
  try {
    const cloudResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resource_type,
    });
    if (localFilePath) {
      fs.unlinkSync(localFilePath);
    }
    return cloudResponse;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    console.log("Error in cloudinary : ", err.message);
  }
};

const deleteFromCloudinary = async (public_id, resource_type) => {
  try {
    const response = await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type,
    });
    return response;
  } catch (err) {
    console.log("Error in coudinary file deletion,", err.message);
  }
};

const deleteManyFromCloudinary = (public_ids, resource_type) => {
  const deleted_res = public_ids.map(async (public_id) => {
    await deleteFromCloudinary(public_id, resource_type);
  });
  return deleted_res;
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteManyFromCloudinary,
};
