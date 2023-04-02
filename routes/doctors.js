const express = require("express");
const {
  getDoctor,
  getDoctors,
  updateDoctor,
} = require("../controllers/doctors.controller.js");

/* JWT Authentication */
const { authenticate } = require("../middleware/authMiddleware.js");
// const middleware = [authenticate]
// router.use(middleware); // all routes get middleware 
/* ---------- */

const router = express.Router();

router.get("/:doctorId", getDoctor);
router.get("/", getDoctors);
router.put("/:doctorId", authenticate, updateDoctor);

module.exports = router;
