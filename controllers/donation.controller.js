const sendTextMessage = require("../config/emailAndMessageSender/sendTextMessage.js");
// const sendTextEmail = require("../config/sendTextEmail.js");
const Donation = require("../models/DonationSchema.js");

const askDonation = async (req, res) => {
  const donationInfo = req.body;
  const { userId } = req;

  try {
    if (donationInfo?.askedBy?._id != userId)
      return res.json({ message: "Unauthorized!" });

    const data = await Donation.create({
      ...donationInfo,
      requestedBy: userId,
    });
    // const EmailDone = sendTextEmail(data.askedTo, data.askedBy);
    const MessageDone = sendTextMessage(data.askedTo, data.askedBy);
    if (MessageDone) return res.status(200).json(MessageDone);

    return res.json({ message: "Something went wrong. Please try again." });
  } catch (error) {
    // console.log(error);
    res.json({ message: error.message || "something went wrong" });
  }
};

const getDonations = async (req, res) => {
  const { userId, role } = req;
  console.log(req.query);
  try {
    const type = req.query.type;
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);
    const bloodGroup = new RegExp(
      req.query.bloodGroup.replace("+", "\\+"),
      "i"
    ); // regex for ignoring case
    const location = new RegExp(req.query.location, "i");

    const filter = {};

    if (!role.includes("admin")) {
      if (type === "requestedByMe") filter["askedBy._id"] = userId;
      if (type === "requestedToMe") filter["askedTo._id"] = userId;
    }

    if (bloodGroup && !"all".match(bloodGroup))
      filter["askedTo.bloodGroup"] = bloodGroup;

    if (location && !"all".match(location))
      filter["askedTo.location"] = location;

    const data = await Donation.find(filter)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);
    const total = await Donation.countDocuments(filter);

    // let requestedToMe, total2;
    // if(role !== "admin"){
    //     delete filter["askedBy._id"];
    //     filter["askedTo._id"] = userId;

    //     requestedToMe = await Donation.find(filter).sort({ date: 1 }).skip(skip).limit(limit);
    //     total2 = await Donation.countDocuments(filter);
    // }

    res.status(200).json({ donations: data, total });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message || "something went wrong" });
  }
};

const updateDonation = async (req, res) => {
  const { donationId } = req.params;
  const donationInfo = req.body;

  try {
    // if (donationInfo?.askedBy?._id != userId) return res.json({ message: "Unauthorized!" });

    const data = await Donation.updateOne(
      { _id: donationId },
      { status: donationInfo.status }
    );

    if (data.nModified) return res.status(200).json(donationInfo);

    return res.json({ message: "Nothing's Changed" });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message || "something went wrong" });
  }
};

module.exports = {
  askDonation,
  getDonations,
  updateDonation,
};
