const express = require("express");
const router = express.Router();

const {notification,adminNotification} = require("../controllers/firebaseController");


router.post("/notification", notification);
router.post("/notification/admin", adminNotification);
router.post("/notification/manufacturer", notification);

module.exports = router;
