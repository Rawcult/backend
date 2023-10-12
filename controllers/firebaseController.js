const { admin } = require("../utils");

const notification = async (req, res) => {
  const { registrationToken, messageBody } = req.body;
  try {
    const message = {
      android: {
        priority: "high",
        ttl: 60 * 60 * 24 * 1000,
        notification: {
          title: "My Notification",
          body: messageBody,
        },
      },
      token: registrationToken,
    };

    await admin.messaging().send(message);
    res.status(200).json({ msg: "Notification sent successfully" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = notification;
