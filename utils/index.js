const { isTokenValid, attachCookiesToResponse } = require("./jwt");
const sendResetPasswordEmail = require("./resetPassEmail");
const createTokenUser = require("./tokenUser");
const sendVerificationEmail = require("./verifyEmail");
const createHash = require("./createHash");
const validateEmail = require("./validateEmail");
const uploadBase64Image = require("./uploadBase64Image");

module.exports = {
  isTokenValid,
  attachCookiesToResponse,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
  createTokenUser,
  validateEmail,
  uploadBase64Image,
};
