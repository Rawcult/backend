const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../controllers/passportConfig")(passport);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.redirect("/profile");
  }
);

router.get("/profile", (req, res) => {
  res.send("User logged in successfully");
});

module.exports = router;
