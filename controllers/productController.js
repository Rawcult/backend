const productModel = require("../models/product");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const createProduct = async (req, res) => {
  let total = 0;
  req.body.user = req.user.userId;

  const { sizes, stocks } = req.body;
  for (const size of sizes) {
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
    products,
    count: products.length,
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

const uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    { use_filename: true, folder: "file-upload" }
  );

  fs.unlinkSync(req.files.image.tempFilePath);

  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
