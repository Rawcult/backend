const express = require("express");
const router = express.Router();
const { addCartItem, getUserItems } = require("../controllers/cartController");

router.post("/addCartItem", addCartItem);
router.get("/getUserItems/:userId", getUserItems);

module.exports = router;
