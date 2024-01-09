const nodemailer = require("nodemailer");
const constant = require("../middleware/constants");

const emailTransporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: constant.emailAddress,
    pass: constant.emailPassword,
  },
  connectionTimeout: 10000,
});

module.exports = { emailTransporter };
