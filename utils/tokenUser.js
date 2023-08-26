const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
    email: user.email,
    firstTimeLogin: user.firstTimeLogin,
    isApproved: user.isApproved,
  };
};

module.exports = createTokenUser;
