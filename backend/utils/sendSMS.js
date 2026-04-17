const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

const sendSMS = async (message) => {
  try {
    const toNumber = process.env.USER_PHONE;
    const fromNumber = process.env.TWILIO_PHONE;


    console.log("📲 TO:", toNumber);
    console.log("📲 FROM:", fromNumber);
    console.log("📩 MESSAGE:", message);

    if (!toNumber || !fromNumber) {
      console.log("❌ Phone नंबर missing in .env");
      return;
    }

    const response = await client.messages.create({
      body: message,
      from: fromNumber,
      to: toNumber
    });

    console.log("✅ SMS SENT SUCCESS");
    console.log("📨 SID:", response.sid);

  } catch (err) {
    console.log("❌ SMS ERROR FULL:", err);

    if (err.code) {
      console.log("❌ Twilio Error Code:", err.code);
      console.log("❌ Twilio Message:", err.message);
    }
  }
};

module.exports = sendSMS;