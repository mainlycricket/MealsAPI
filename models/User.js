const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
    trim: true,
  },

  email: {
    type: String,
    unique: true,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },

  role: {
    type: String,
    // enum: ['user', 'admin']    // can add when admin role is required
    default: "user",
  },

  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },

  verificationToken: {
    type: String,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verified: {
    type: Date,
  },

  passwordToken: {
    type: String,
  },

  passwordTokenExpirationDate: {
    type: Date,
  },
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
