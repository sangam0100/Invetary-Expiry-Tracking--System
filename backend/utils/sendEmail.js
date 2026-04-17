const nodemailer = require("nodemailer");

let transporter;

// transporter setup
if (process.env.EMAIL && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });
}

// reusable email function
module.exports = async (to, subject, text) => {
  try {
    if (!transporter) {
      console.log("⚠️ Email not configured");
      console.log("TO:", to);
      console.log("MESSAGE:", text);
      return;
    }

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: to,          //  dynamic user email
      subject: subject, //  dynamic subject
      text: text       //  dynamic message
    });

    console.log("✅ Email Sent to:", to);
  } catch (error) {
    console.log("❌ Email Error:", error.message);
  }
};