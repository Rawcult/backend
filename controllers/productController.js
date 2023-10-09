const productModel = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const searchSubCategories = require("../utils/search");
const { uploadBase64Image } = require("../utils");

const createProduct = async (req, res) => {
  let total = 0;
  req.body.user = req.user.userId;

  const { sizes, stocks } = req.body;
  for (let size of sizes) {
    total += size.quantity;
  }
  if (total !== stocks)
    throw new customError.BadRequest(
      "Stocks amount not matched with the items quantity!"
    );
  const product = await productModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await productModel.find({});
  res.status(StatusCodes.OK).json({
    count: products.length,
    products,
  });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await productModel.findOne({ _id: productId });

  if (!product)
    throw new customError.NotFound(`No product with id: ${productId}`);

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await productModel.findByIdAndUpdate(
    { _id: productId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!product)
    throw new customError.NotFound(`No product with id: ${productId}`);

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await productModel.findOne({ _id: productId });

  if (!product)
    throw new customError.NotFound(`No product with id: ${productId}`);

  await product.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "Success! Product Deleted!" });
};

// const uploadImage = async (req, res) => {
//   const result = await cloudinary.uploader.upload(
//     req.files.image.tempFilePath,
//     { use_filename: true, folder: "file-upload" }
//   );

//   fs.unlinkSync(req.files.image.tempFilePath);

//   return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
// };

const uploadImage = async (req, res) => {
  try {
    const { base64Image, format } = req.body;
    if (!format) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Please provide a file format!" });
    }

    if (!base64Image) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No valid base64 image data provided" });
    }

    const formattedBase64Data = `data:image/${format};base64,${base64Image}`;
    const result = await uploadBase64Image(formattedBase64Data, format);

    return res.status(StatusCodes.OK).json({ image: result.secure_url });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Error uploading image",
    });
  }
};

const subCategories = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const subCategories = await searchSubCategories(searchQuery);
    res.status(StatusCodes.OK).json(subCategories);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

const getUserProduct = async (req, res) => {
  const { id: userId } = req.params;

  const products = await productModel.find({ user: userId });
  if (!products) {
    throw new customError.BadRequest(
      "No products associated with this user found!"
    );
  }

  res.status(StatusCodes.OK).json({ count: products.length, products });
};

const getSubCategory = async (req, res) => {
  const { category, subCategory } = req.body;

  const product = await productModel.find({
    $and: [{ category }, { subCategory }],
  });

  res.status(StatusCodes.OK).json({ product });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  subCategories,
  getUserProduct,
  getSubCategory,
};
