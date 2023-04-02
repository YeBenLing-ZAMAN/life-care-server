const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: [
    {
      type: String,
      required: true,
      default: "donor",
    },
  ],
  // permissions: [{ name: String }],
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  location: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  eligibility: {
    type: String,
    default: "eligible",
  },
  lastDonationDate: {
    type: Date,
  },
  degrees: {
    type: Array,
  },
  speciality: {
    type: Array,
  },
  bmdcNumber: {
    type: String,
  },
  consultationFee: {
    type: Number,
  },
  followUpFee: {
    type: Number,
  },
  totalExperienceYears: {
    type: Number,
  },
  isVerifiedDoctor: {
    type: String,
    default: "Not Verified",
  },
});
// .plugin(permissions);

// will encrypt password every time its saved
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
