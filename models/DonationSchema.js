const mongoose = require("mongoose");
const { Schema } = mongoose;

const donationSchema = new mongoose.Schema({
  askedBy: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    location: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  askedTo: {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    location: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  date: {
    type: Date,
    require: true,
  },
  details: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
});

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;
