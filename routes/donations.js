const express = require("express");
const {
  askDonation,
  getDonations,
  updateDonation,
} = require("../controllers/donation.controller.js");
const { donationLimiter } = require("../middleware/rateLimit.js");

/* JWT Authentication */
const { authenticate } = require("../middleware/authMiddleware.js");
// router.use(middleware);
/* ---------- */
const router = express.Router();

router.get("/", authenticate, getDonations);
router.post("/", donationLimiter, authenticate, askDonation);
router.put("/:donationId", authenticate, updateDonation);

module.exports = router;
