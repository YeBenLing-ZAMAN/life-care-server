const express = require("express");
const {
  checkEmail,
  getUser,
  login,
  signup,
  updateProfile,
  getUserInfo,
} = require("../controllers/users.controller.js");
const { loginLimiter, signupLimiter } = require("../middleware/rateLimit.js");
const { signupValidator } = require("../middleware/signupValidator.js");

/* JWT Authentication */
const { authenticate } = require("../middleware/authMiddleware.js");
// const middleware = [authenticate]
// router.use(middleware); // all routes get middleware
/* ---------- */

const router = express.Router();

router.get("/check_email/:email", checkEmail);
router.post("/login", loginLimiter, login);
router.post("/register", signupLimiter, signupValidator, signup);
router.get("/get_user", authenticate, getUserInfo);
router.get("/", authenticate, getUser);
router.put("/", authenticate, updateProfile);

module.exports = router;
