const sgMail = require("@sendgrid/mail");

const sendEmail = async ({ to, subject, html }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to,
    from: `Abhijeet <${process.env.SENDER_EMAIL}>`,
    subject,
    html,
  };
  return sgMail.send(msg);
};

module.exports = sendEmail;
