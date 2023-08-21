module.exports = {
  service: "Gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_ADDRESS,
    accessToken,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
};
