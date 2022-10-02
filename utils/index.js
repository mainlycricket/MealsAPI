const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/sendVerificationEmail");
const {
  createJWT,
  createUserToken,
  attachCookieToResponse,
  verifyJWT,
} = require("../utils/jwt");

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  createJWT,
  createUserToken,
  attachCookieToResponse,
  verifyJWT,
};
