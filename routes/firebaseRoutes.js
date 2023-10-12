const express = require("express");
const router = express.Router();

const notification = require("../controllers/firebaseController");

router.post("/notification", notification);

module.exports = router;
