const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },

  name: {
    type: String,
    required: [true, "Please provide a name!"],
    trim: true,
  },

  mfdUnit: {
    type: String,
  },

  unitAddress: {
    type: String,
  },

  shopAddress: {
    type: String,
  },

  shopName: {
    type: String,
  },

  phone: {
    type: String,
    validate: {
      validator: function (value) {
        return validator.isMobilePhone(value, "en-IN");
      },
      message: "Please provide a valid phone number!.",
    },
    // unique: true,
  },

  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email!",
    },
  },

  gstNo: {
    type: String,
  },

  aadhaarOrPan: {
    type: String,
  },

  image: {
    type: String,
    default: "/uploads/example.jpeg",
  },

  productDeal: {
    type: String,
  },

  bankAccount: {
    type: String,
  },

  password: {
    type: String,
    // required: [true, "Please provide a password"],
    validate: {
      validator: validator.isStrongPassword,
      message:
        "Password should contain atleast 8 letters with 1 uppercase, 1 lowercase, 1 number and 1 symbol",
    },
  },

  role: {
    type: String,
    enum: ["retailer", "manufacturer"],
  },

  verificationToken: String,

  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },

  verified: Date,

  passwordToken: {
    type: String,
  },

  passwordTokenExpirationDate: {
    type: Date,
  },

  firstTimeLogin: {
    type: Boolean,
    default: true,
  },

  isApproved: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
