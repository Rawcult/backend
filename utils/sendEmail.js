const nodemailer = require("nodemailer");
// const nodemailerConfig = require("./emailConfig");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const sendEmail = async ({ to, subject, html }) => {
  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log("*ERR: ", err);
          reject();
        }
        resolve(token);
      });
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_ADDRESS,
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });
    return transporter.sendMail({
      from: `Rawcult Team <${process.env.EMAIL_ADDRESS}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    return err;
  }
};

module.exports = sendEmail;
