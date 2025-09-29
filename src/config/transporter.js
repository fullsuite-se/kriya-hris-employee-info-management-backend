const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.NODEMAILER_USER_HRIS,
    pass: process.env.NODEMAILER_PASSWORD_HRIS,
  },
  connectionTimeout: 15000,
  socketTimeout: 15000,
});

module.exports = transporter;
