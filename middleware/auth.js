const { Unauthorized, Forbidden } = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new Unauthorized("Invalid Authentication!");
  }

  const token = authHeader.split(" ")[1];
  try {
    const {
      accessToken: { name, userId, role, email, firstTimeLogin, isApproved },
    } = isTokenValid(token);
    req.user = {
      name,
      userId,
      role,
      email,
      firstTimeLogin,
      isApproved,
    };
    next();
  } catch (error) {
    throw new Unauthorized("Invalid Authentication!");
  }
};

const authorizedPermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new Forbidden("You aren't authorize to access this route");
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizedPermission,
};
