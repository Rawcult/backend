const nodemailer = require("nodemailer");
const nodemailerConfig = require("./emailConfig");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"Tech Synergia" <info@techsynergia.com>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
