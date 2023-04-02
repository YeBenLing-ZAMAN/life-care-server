const Client = require("twilio");

const sendTextMessage = async (askedTo, askedBy) => {
  const client = new Client(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const result = await client.messages.create({
      body: `Hello ${askedTo.name},
              you have a donation request from ${askedBy.name}. 
              Please contact at ${askedBy.phoneNumber}
              Please contact email number at ${askedBy.email}`,
      to: askedTo.phoneNumber,
      from: process.env.TWILIO_FROM_NUMBER,
    });
    console.log(result);

    return result.sid ? true : false;
  } catch (error) {
    console.log(error);
    return;
  }
};

module.exports = sendTextMessage;
