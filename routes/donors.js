const express = require("express");
const { getDonor, getDonors } = require("../controllers/donors.controller.js");

/* JWT Authentication */
const { authenticate } = require("../middleware/authMiddleware.js");
// router.use(middleware);
/* ---------- */

const router = express.Router();

router.get("/:donorId", authenticate, getDonor);
router.get("/", getDonors);

module.exports = router;
