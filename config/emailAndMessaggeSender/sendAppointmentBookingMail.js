const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;

let apikey = process.env.EMAIL_SENDER_KEY
// Configure API key authorization: api-key
var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = apikey;

function sendAppointmentBookingMail(booking) {
  const { patient, patientName, treatment, data, slot } = booking;
  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
  sendSmtpEmail = {
    sender: { email: process.env.SENDER_EMAIL },
    to: [
      {
        email: patient,
        name: patientName,
      },
    ],
    subject: `Your Appointment for ${treatment} is on ${data} at ${slot} is confirmed`,
    textContent: `Your Appointment for ${treatment} is on ${data} at ${slot} is confirmed`,
  };
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log("API called successfully. Returned data: " + data);
    },
    function (error) {
      console.error(error);
    }
  );
}

module.exports = sendAppointmentBookingMail;
