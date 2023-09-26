const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
  getMnfOrders,
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

router.get("/getMnfOrders/:mnfId", getMnfOrders);

module.exports = router;
