const { validate } = require("deep-email-validator");

const validateEmail = async (email) => {
  let res = await validate({
    email,
    validateRegex: true,
    validateMx: true,
    validateTypo: true,
    validateDisposable: true,
    // validateSMTP: true,
  });
  return res.valid;
};

module.exports = validateEmail;
