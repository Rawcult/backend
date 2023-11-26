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


const removeCartItem  = async (req,res)=>{
const {productId,seletedSize ,selectedColor}  = req.query
const {userId}  = req.params
try{
  const product  = await cartModel.findOne({ productId, userId });
  if (!product) {
    return res.status(StatusCodes.BAD_REQUEST).send('Product not found');
  }
  // Remove the item from the sizes array
  product.sizes = product.sizes.filter(size => !(size.size === seletedSize && size.color === selectedColor));
  await product.save();
  return res.status(StatusCodes.OK).send('Product removed successfully');
}catch(err){
  console.log(err)
}
}

module.exports = { addCartItem, getUserItems,removeCartItem };
