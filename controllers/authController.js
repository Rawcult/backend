const userModel = require("../models/user");
const tokenModel = require("../models/token");
const crypto = require("crypto");
const customError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
  attachCookiesToResponse,
  createTokenUser,
  createHash,
  // validateEmail,
} = require("../utils");

const origin =
  process.env.NODE_ENV === "production"
    ? "https://rawcult.netlify.app"
    : "http://localhost:5173";

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role)
    throw new customError.BadRequest("Please fill all the fields!");
  // const emailSpamFilter = await validateEmail(email);

  // if (!emailSpamFilter) {
  //   throw new customError.BadRequest(`${email} not a valid email`);
  // }

  const emailAlreadyExists = await userModel.findOne({ email });

  if (emailAlreadyExists)
    throw new customError.BadRequest("Email already exists!");

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await userModel.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify the account",
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) throw new customError.Unauthorized("Verification Failed");

  if (user.verificationToken !== verificationToken)
    throw new customError.Unauthorized("Verification Failed");

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Email Verified!" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new customError.BadRequest("Please provide email and password!");

  const user = await userModel.findOne({ email });
  if (!user) throw new customError.Unauthorized("Invalid Credentials!");

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect)
    throw new customError.Unauthorized("Invalid Credentials");

  if (!user.isVerified)
    throw new customError.Unauthorized("Please verify your email!");

  const accessToken = createTokenUser(user);

  let refreshToken = "";
  const existingToken = await tokenModel.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new customError.Unauthorized("Invalid access!");
    }

    refreshToken = existingToken.refreshToken;
    const tokens = attachCookiesToResponse({ res, accessToken, refreshToken });
    res.status(StatusCodes.OK).json({ user: accessToken, tokens });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await tokenModel.create(userToken);
  const tokens = attachCookiesToResponse({ res, accessToken, refreshToken });
  res.status(StatusCodes.OK).json({ user: accessToken, tokens });
};

const logout = async (req, res) => {
  await tokenModel.findOneAndDelete({ user: req.user.userId });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: "Success! User logged out!" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    throw new customError.BadRequest("Please provide your registered email!");

  const user = await userModel.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = createHash(passwordToken);
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  if (!token || !email || !password)
    throw new customError.BadRequest("Please provide all details");

  const user = await userModel.findOne({ email });
  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  res.send("Password Reset Successfully!");
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
