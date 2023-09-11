const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/auth");

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  subCategories,
} = require("../controllers/productController");

router.route("/").post(authenticateUser, createProduct).get(getAllProducts);
router.post("/uploadImage", authenticateUser, uploadImage);
router.get("/search", subCategories);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authenticateUser, updateProduct)
  .delete(authenticateUser, deleteProduct);

module.exports = router;
