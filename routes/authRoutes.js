const router = require("express").Router();

const {
  register,
  verifyEmail,
  login,
  logout,
} = require("../controllers/authController");

router.post("/register", register);
router.get("/verifyEmail", verifyEmail);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
