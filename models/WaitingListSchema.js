const mongoose = require("mongoose");
const { Schema } = mongoose;

const waitingListSchema = new Schema({
  patientId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  // Optionals
  serial: {
    type: Number,
  },
  email: {
    type: String,
  },
  name: {
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
});

const WaitingList = mongoose.model("WaitingList", waitingListSchema);
module.exports = WaitingList;
