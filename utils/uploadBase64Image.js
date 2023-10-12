const cloudinary = require("cloudinary").v2;

const uploadBase64Image = async (base64Data) => {
  try {
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: "file-upload",
      // format,
    });

    return result;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

module.exports = uploadBase64Image;
