const express = require("express");
const {
  addBloodRequest,
  getRequests,
  updateRequest,
} = require("../controllers/bloodRequest.controller.js");

/* JWT Authentication */
const { authenticate } = require("../middleware/auth.js");
// router.use(middleware);
/* ---------- */

const router = express.Router();

router.post("/", authenticate, addBloodRequest);
router.get("/", authenticate, getRequests);
router.put("/:requestId", authenticate, updateRequest);

module.exports = router;
