const admin = require("firebase-admin");

// const serviceAccount = require("../your-private-key.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://sample-project-e1a84.firebaseio.com",
// });

module.exports.admin = admin;
