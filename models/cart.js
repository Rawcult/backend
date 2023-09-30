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
});

const cartSchema = new Schema({
  productId: String,
  userId: String,
  sizes: [SizeSchema],
  quantity: String,
  colors: {
    type: [String],
    default: ["#222"],
    required: true,
  },
});

module.exports = model("Cart", cartSchema);
