const { BCrypt, JWT } = require("jwt-auth-helper");
const User = require("../models/UserSchema");

const jwt = new JWT(process.env.JWT_SECRET_KEY || "JWT_SECRET_KEY");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // const existingUser = await User.findOne({ email });
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });
    if (!existingUser)
      return res.status(400).json({ message: "User doesn't exist!" });

    const isPasswordCorrect = await BCrypt.compareHash(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid username or password!" });

    const token = jwt.generateJWTToken(
      {
        email: existingUser.email,
        id: existingUser._id,
        role: existingUser.role,
      },
      "1h"
    );

    res.status(200).json({ user: existingUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const signup = async (req, res) => {
  const { email, password, confirmPassword, lastDonationDate, role } = req.body;

  try {
    let userRole = ["donor"];
    let eligibility = "eligible";

    if (role === "doctor") userRole.push("doctor");

    if (lastDonationDate) {
      const donationBefore =
        new Date().getTime() - Date.parse(lastDonationDate);
      const fourMonth = 4 * 30 * 24 * 60 * 60 * 1000;
      eligibility = donationBefore >= fourMonth ? "eligible" : "not eligible";
    }

    const existingUser = await User.findOne({ email });

    if (existingUser?.email)
      return res.json({ message: "User already exists! Please login now" });
    const result = await User.create({
      email,
      password: password,
      role: userRole,
      eligibility,
    });

    const token = jwt.generateJWTToken(
      { email: result.email, id: result._id, role: result.role },
      "1h"
    );

    res.status(200).json({ user: result, token });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message || "Something went wrong!" });
  }
};

const getUser = async (req, res) => {
  const { userId } = req;

  try {
    const existingUser = await User.findOne({ _id: userId });
    if (!existingUser)
      return res.status(400).json({ message: "User doesn't exist!" });

    res.status(200).json({ user: existingUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const updateProfile = async (req, res) => {
  const profileInfo = req.body;
  const { userId } = req;

  try {
    const existingUser = await User.findOne({
      _id: profileInfo._id,
      email: profileInfo.email,
    });
    if (!existingUser)
      return res
        .status(400)
        .json({ message: "No user found for this profile!" });

    if (existingUser._id != userId)
      return res.status(400).json({ message: "Unauthorized!" });

    const result = await User.updateOne({ _id: userId }, profileInfo);

    if (result.nModified > 0)
      return res.status(200).json({ user: profileInfo });

    res.json({ message: "Nothing's changed!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = {
  updateProfile,
  getUser,
  signup,
  login,
};
