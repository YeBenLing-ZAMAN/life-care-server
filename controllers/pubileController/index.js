const User = require("../../models/UserSchema");

// check email number
const checkEmail = async (req, res) => {
    try {
      const email = req.params.email;
      if (!email) {
        res.status(400).json({
          message: "Please fill email felid",
        });
      } else {
        const user = await User.findOne({ email: email });
        if (user) {
          res.status(400).json({
            message: "Email taken",
          });
        } else {
          res.status(200).json({
            message: "Available email",
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: error.toString(),
      });
    }
  };