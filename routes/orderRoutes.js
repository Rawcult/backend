const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderController");

router
  .route("/")
  .get(authenticateUser, getAllOrders)
  .post(authenticateUser, createOrder);
router.get("/myorders", authenticateUser, getCurrentUserOrders);
router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

module.exports = router;
