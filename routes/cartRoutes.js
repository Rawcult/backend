const express = require("express");
const router = express.Router();
const { addCartItem, getUserItems } = require("../controllers/cartController");
const { authenticateUser } = require("../middleware/auth");

router.post("/addCartItem", authenticateUser, addCartItem);
router.get("/getUserItems/:userId", authenticateUser, getUserItems);

module.exports = router;
