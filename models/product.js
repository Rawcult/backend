const mongoose = require("mongoose");

const SizeSchema = new mongoose.Schema({
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

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name!"],
      maxlength: [100, "Name cannot be more than 100 characters"],
    },

    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },

    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [1000, "Name cannot be more than 1000 chracters"],
    },

    image: {
      type: String,
      default: "/uploads/example.jpeg",
    },

    sizes: [SizeSchema],

    // fitType: {
    //   type: String,
    // },

    category: {
      type: String,
      required: [true, "Please provide a category!"],
      enum: ["mens wear", "womens wear", "kids wear", "accessories"],
    },

    subCategory: {
      type: String,
      required: [true, "Please provide a sub-category!"],
      enum: ["top wear", "bottom wear", "sports wear"],
    },

    minQty: {
      type: Number,
    },

    colors: {
      type: [String],
      default: ["#222"],
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    freeShipping: {
      type: Boolean,
      default: false,
    },

    stocks: {
      type: Number,
      required: true,
      // default: 20,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
