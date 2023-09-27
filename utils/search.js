const productModel = require("../models/product");

async function searchSubCategories(searchQuery) {
  const pipeline = [
    {
      $match: {
        $or: [
          { subCategory: { $regex: new RegExp(searchQuery, "i") } },
          { category: { $regex: new RegExp(searchQuery, "i") } },
          { name: { $regex: new RegExp(searchQuery, "i") } },
        ],
      },
    },
  ];

  const matchingProducts = await productModel.aggregate(pipeline);

  return matchingProducts;
}

module.exports = searchSubCategories;
