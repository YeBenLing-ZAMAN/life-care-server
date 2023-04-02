const express = require("express");
const {
  addBloodRequest,
  getRequests,
  updateRequest,
} = require("../controllers/bloodRequest.controller.js");

const router = express.Router();
/* JWT Authentication */
const { authenticate } = require("../middleware/authMiddleware.js");
const middleware = [authenticate];
router.use(middleware); // all routes get middleware
/* ---------- */


router.post("/", addBloodRequest);
router.get("/", getRequests);
router.put("/:requestId", updateRequest);

module.exports = router;
