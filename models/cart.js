const { Schema, model } = require("mongoose");

const SizeSchema = new Schema({
  size: {
    type: String,
    enum: ["S", "M", "L", "XL", "XXL"],
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 0,
  },

  color: {
    type: String,
    required: true,
  },
});

const cartSchema = new Schema({
  productId: String,
  userId: String,
  productName: String,
  description: String,
  sizes: [SizeSchema],
  totalQuantity: String,
  price: Number,
  image: Array,
});

module.exports = model("Cart", cartSchema);
