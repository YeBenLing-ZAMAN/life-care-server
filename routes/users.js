const express = require("express");
const {
  getUser,
  login,
  signup,
  updateProfile,
} = require("../controllers/users.controller.js");
const { loginLimiter, signupLimiter } = require("../middleware/rateLimit.js");
const { signupValidator } = require("../middleware/signupValidator.js");

/* JWT Authentication */
const { authenticate } = require("../middleware/authMiddleware.js");
// const middleware = [authenticate]
// router.use(middleware); // all routes get middleware 
/* ---------- */

const router = express.Router();

router.post("/login", loginLimiter, login);
router.post("/signup", signupLimiter, signupValidator, signup);
router.get("/", authenticate, getUser);
router.put("/", authenticate, updateProfile);

module.exports = router;
