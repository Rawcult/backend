const { isTokenValid, attachCookiesToResponse } = require("./jwt");
const sendResetPasswordEmail = require("./resetPassEmail");
const createTokenUser = require("./tokenUser");
const sendVerificationEmail = require("./verifyEmail");
const createHash = require("./createHash");
const validateEmail = require("./validateEmail");

module.exports = {
  isTokenValid,
  attachCookiesToResponse,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
  createTokenUser,
  validateEmail,
};
