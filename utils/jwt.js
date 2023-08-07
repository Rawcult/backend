const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
};

const isTokenValid = (token) => jwt.verify(token, process.env.JWT);

const attachCookiesToResponse = ({ res, accessToken, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { accessToken } });

  const refreshTokenJWT = createJWT({
    payload: { accessToken, refreshToken },
  });

  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });
};

module.exports = {
  isTokenValid,
  attachCookiesToResponse,
};
