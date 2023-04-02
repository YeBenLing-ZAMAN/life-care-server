const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: "Slow Down :)",
});

const signupLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000,
  max: 5,
  message: ":)",
});

const donationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 3,
  message: "You can't ask for more donations today. Please come back tomorrow.",
});

module.exports = {
  loginLimiter,
  signupLimiter,
  donationLimiter,
};
