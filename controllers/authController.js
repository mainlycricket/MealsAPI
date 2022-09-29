const UserModel = require("../models/User");

const CustomAPIError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

const {
  sendVerificationEmail,
  createUserToken,
  attachCookieToResponse,
} = require("../utils");

const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    throw new CustomAPIError.BadRequestError("Please provide all details");
  }

  if (password != confirmPassword) {
    throw new CustomAPIError.BadRequestError(`Passwords don't match`);
  }

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await UserModel.create({
    name,
    email,
    password,
    verificationToken,
  });

  await sendVerificationEmail(user.name, user.email, user.verificationToken);

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: "Please check your mail" });
};

const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.query;

  const user = await UserModel.findOne({ email });

  if (!user || user.verificationToken != verificationToken) {
    throw new CustomAPIError.NotFoundError(`Verification Failed`);
  }

  user.isVerified = true;
  user.verified = new Date(Date.now());

  await user.save();

  res.status(StatusCodes.OK).json({ success: true, msg: "User Verified" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomAPIError.BadRequestError("Please provide all details");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new CustomAPIError.UnauthenticatedError("Authentication failed");
  }

  if (!user.isVerified) {
    throw new CustomAPIError.UnauthenticatedError("Please verify your email");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new CustomAPIError.UnauthenticatedError("Authentication failed");
  }

  const userToken = createUserToken(user);
  attachCookieToResponse(res, userToken);

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "User Logged in",
  });
};

const logout = async (req, res) => {
  res.cookie("accessToken", "", {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now()),
  });
  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "logged out successfully" });
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
};
