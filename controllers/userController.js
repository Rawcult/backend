const userModel = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const { createTokenUser, attachCookiesToResponse } = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await userModel.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req, res) => {
  const user = await userModel
    .findOne({ _id: req.params.id })
    .select("-password");

  if (!user)
    throw new customError.NotFound(`No user with id: ${req.params.id}`);

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  const {
    name,
    email,
    mfUnit,
    unitAddress,
    shopName,
    shopAddress,
    phone,
    gstNo,
    image,
    aadhaarOrPan,
    productDeal,
    bankAccount,
  } = req.body;
  if (!name || !email)
    throw new customError.BadRequest("Please provide all values");

  const user = await userModel.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;
  user.mfdUnit = mfUnit;
  user.unitAddress = unitAddress;
  user.phone = phone;
  user.image = image;
  user.gstNo = gstNo;
  user.aadhaarOrPan = aadhaarOrPan;
  user.productDeal = productDeal;
  user.bankAccount = bankAccount;
  user.shopName = shopName;
  user.shopAddress = shopAddress;
  await user.save();

  const accessToken = createTokenUser(user);
  attachCookiesToResponse({ res, accessToken });
  res.status(StatusCodes.OK).json({ user: accessToken });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new customError.BadRequest("Please provide all values!");

  const user = await userModel.findOne({ _id: req.user.userId });
  console.log(user);

  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect)
    throw new customError.Unauthorized("Invalid Credentials!");

  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated!" });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
