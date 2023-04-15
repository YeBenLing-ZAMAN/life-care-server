const express = require("express");
const {
  askDonation,
  getDonations,
  updateDonation,
  getBloodRequestSendToDonor,
  getBloodRequestReceivedFromRequester,
} = require("../controllers/donation.controller.js");
const { donationLimiter } = require("../middleware/rateLimit.js");

/* JWT Authentication */
const { authenticate } = require("../middleware/authMiddleware.js");
// router.use(middleware);
/* ---------- */
const router = express.Router();

router.get("/", authenticate, getDonations);
router.get("/getBloodRequestSendToDonor",authenticate,getBloodRequestSendToDonor);
router.get("/getBloodRequestReceivedFromRequester",authenticate,getBloodRequestReceivedFromRequester);
router.post("/", donationLimiter, authenticate, askDonation);
router.put("/:donationId", authenticate, updateDonation);

module.exports = router;
