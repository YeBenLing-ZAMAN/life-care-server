// dotenv must implemented on top cause jwt-auth-helper depends on process.envy
const { JWT } = require("jwt-auth-helper");
require("dotenv").config();

const authenticate = async (req, res, next) => {
  // console.log(req.headers);
  try {
    // If give no parameter , it takes process.env.JWT_SECRET_KEY by default
    const jwt = new JWT();
    // const token = req.headers.authorization?.split(" ")[1];
    let token = req.headers["authorization"];
    const isCustomAuth = token?.length < 500;
    let decodedData;
    if (token && isCustomAuth) {
      decodedData = jwt.verifyToken(token);
      // console.log(decodedData);
      req.userId = decodedData?.id;
      req.role = decodedData?.role;
    } else {
      decodedData = jwt.verifyToken(token);
      req.userId = decodedData?.sub;
      req.role = decodedData?.role;
    }
    if (!req.userId) return res.json({ message: "Unauthorized!!" });

    next();
  } catch (error) {
    console.log(error);
    res.json({ message: "Unauthenticated!" });
  }
};

module.exports = { authenticate };
