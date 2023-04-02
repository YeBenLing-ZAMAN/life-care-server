const { JWT } = require("jwt-auth-helper");
const User = require("../models/UserSchema.js");

const getDoctors = async (req, res) => {
  let role, admin;

  // Checking if admin or other user
  try {
    const jwt = new JWT();
    const token = req.headers.authorization?.split(" ")[1];
    let decodedData;

    if (token) {
      decodedData = jwt.verifyToken(token);
      role = decodedData?.role;
      admin = role?.includes("admin");
    }
  } catch (error) {
    console.log(error);
  }

  let filter = { role: "doctor" };

  if (!admin) {
    filter.isVerifiedDoctor = "Verified";
  }

  const { valueToLimit } = req.query;

  if (Object.keys(req.query)?.length) {
    const { bloodGroup, location, date, eligibility } = req.query;
    const bloodGroupRegex = new RegExp(bloodGroup, "i");
    const locationRegex = new RegExp(location, "i");

    filter.bloodGroup = bloodGroupRegex;
    filter.location = locationRegex;
  }

  try {
    const doctors = await User.find(filter).limit(
      valueToLimit ? +valueToLimit : 0
    );
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const getDoctor = async (req, res) => {
  const { doctorId } = req.params;

  if (!doctorId.match(/^[0-9a-fA-F]{24}$/))
    return res.json({ message: "No profile found" });

  try {
    const existingUser = await User.findOne({ _id: doctorId });
    if (!existingUser) return res.json({ message: "User doesn't exist!" });

    res.status(200).json(existingUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const updateDoctor = async (req, res) => {
  const { doctorId } = req.params;
  const { role } = req;
  const doctorInfo = req.body;

  if (!doctorId.match(/^[0-9a-fA-F]{24}$/))
    return res.json({ message: "No profile found" });

  try {
    if (!role?.includes("admin")) return res.json({ message: "Unauthorized!" });

    const existingUser = await User.findOne({ _id: doctorId });

    if (!existingUser) return res.json({ message: "Doctor doesn't exist!" });
    // const data = await User.updateOne({ _id: doctorId }, {isVerifiedDoctor: doctorInfo.isVerifiedDoctor});
    // if(data.nModified) return res.status(200).json(doctorInfo);
    // return res.json({ message: "Nothing's Changed" });

    const updateUserStatus = await User.findOneAndUpdate(
      { _id: doctorId },
      {
        $set: {
          isVerifiedDoctor: "Verified",
        },
      }
    );
    if (updateUserStatus) {
      res.status(200).json(updateUserStatus);
    } else {
      res.json({ message: "Nothing's Changed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = {
  updateDoctor,
  getDoctor,
  getDoctors,
};
