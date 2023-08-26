const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizedPermission,
} = require("../middleware/auth");

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserPassword,
  updateUser,
  adminApproval,
} = require("../controllers/userController");

router.get("/", authenticateUser, authorizedPermission("admin"), getAllUsers);
router.get("/showMe", authenticateUser, showCurrentUser);
router.get("/:id", authenticateUser, getSingleUser);
router.patch("/updateUserPass", authenticateUser, updateUserPassword);
router.patch("/updateUser", authenticateUser, updateUser);
router.patch(
  "/adminApproval",
  authenticateUser,
  authorizedPermission("admin"),
  adminApproval
);

module.exports = router;
