const mongoose = require("mongoose");
const { Schema } = mongoose;

const modelSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
  },
  profilePic: String,
  phone: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
});

const Profile = mongoose.model("Profile", modelSchema);
module.exports = Profile;
