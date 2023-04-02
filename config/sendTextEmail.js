const nodemailer = require("nodemailer");

const sendTextEmail = (askedTo, askedBy) => {
  let transpoter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "*************",
      pass: "*************",
    },
  });

  let mailOption = {
    from: "mdkzaman2025@gmail.com",
    to: user.email,
    subject: "blood donation request",
    text: `Hello ${askedTo.name},
            you have a donation request from ${askedBy.name}. 
            Please contact mobile number at ${askedBy.phoneNumber}
            Please contact email number at ${askedBy.email}`,
    html: `<div">
              <div  style="padding: 0 60px; width: 100%;">
                    <h2>Hello! ${askedTo.name},</h2>
                    <p style="text-align: left;">you have a donation request from ${askedBy.name}</p>
                    <p style="text-align: left; margin-left: 20px">Please contact mobile number at ${askedBy.phoneNumber}</p>
                    <p style="text-align: left; margin-left: 20px">Please contact email at ${askedBy.email}</p>      
              </div>
          </div>`,
  };

  transpoter.sendMail(mailOption, async (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendTextEmail;
