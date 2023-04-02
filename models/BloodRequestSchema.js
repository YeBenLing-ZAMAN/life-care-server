const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  bloodGroup: String,
  location: String,
  date: Date,
  numberOfBags: Number,
  requestedBy: {
    _id: { type: String, required: true },
    name: { type: String },
    email: { type: String, required: true },
    bloodGroup: { type: String },
    location: { type: String },
    phoneNumber: { type: String },
  },
  requestedAt: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: String,
    default: "Pending",
  },
});

const BloodRequest = mongoose.model("BloodRequest", requestSchema);
module.exports = BloodRequest;