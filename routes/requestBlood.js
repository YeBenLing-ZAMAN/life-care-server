const express = require("express");
const {
  addBloodRequest,
  getRequests,
  updateRequest,
} = require("../controllers/bloodRequest.controller.js");

/* JWT Authentication */
const { authenticate } = require("../middleware/authMiddleware.js");
const middleware = [authenticate];
router.use(middleware); // all routes get middleware
/* ---------- */

const router = express.Router();

router.post("/", addBloodRequest);
router.get("/", getRequests);
router.put("/:requestId", updateRequest);

module.exports = router;
