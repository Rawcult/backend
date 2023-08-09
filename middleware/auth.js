const customError = require("../errors");

const { isTokenValid, attachCookiesToResponse } = require("../utils");

const tokenModel = require("../models/token");

const authenticateUser = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken);
      req.user = payload.accessToken;
      return next();
    }
    const payload = isTokenValid(refreshToken);
    const existingToken = await tokenModel.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new customError.Unauthorized("Invalid Authentication");
    }

    attachCookiesToResponse({
      res,
      accessToken: payload.user,
      refreshToken: existingToken.accessToken,
    });
    req.user = payload.user;
    next();
  } catch (error) {
    console.log(error);
  }
};

const authorizedPermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new customError.Forbidden(
        "You aren't authorize to access this route"
      );
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizedPermission,
};
