const productModel = require("../models/product");

async function searchSubCategories(searchQuery) {
  const pipeline = [
    {
      $match: {
        subCategory: { $regex: new RegExp(searchQuery, "i") }, // Match subCategory field
      },
    },
  ];

  // Execute the aggregation pipeline
  const matchingProducts = await productModel.aggregate(pipeline);

  return matchingProducts;
}

module.exports = searchSubCategories;
