const { StatusCodes } = require("http-status-codes");
const cartModel = require("../models/cart");

const addCartItem = async (req, res) => {
  const item = await cartModel.create(req.body);
  res.status(StatusCodes.CREATED).json({ item });
};

const getUserItems = async (req, res) => {
  const { userId } = req.params;
  const items = await cartModel.find({ userId });
  res.status(StatusCodes.OK).json({ items });
};

module.exports = { addCartItem, getUserItems };
