const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserPassword,
  updateUser,
} = require("../controllers/userController");

router.get("/", authenticateUser, getAllUsers);
router.get("/showMe", authenticateUser, showCurrentUser);
router.get("/:id", authenticateUser, getSingleUser);
router.patch("/updateUserPass", authenticateUser, updateUserPassword);
router.patch("/updateUser", authenticateUser, updateUser);

module.exports = router;
