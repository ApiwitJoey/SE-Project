const User = require("../models/User");
const crypto = require('crypto');
const nodemailer = require("nodemailer");

// POST public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, telephone } = req.body;

    const user = await User.create({
      name,
      email,
      role,
      password,
      telephone,
    });

    // const token = user.getSignedJwtToken();
    // res.status(200).json({ success: true, token });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide an email and password" });
  }

  const user = await User.findOne({ email }).select("+password"); // shorthand for User.findOne({ email : email }).select("+password");

  if (!user) {
    return res.status(400).json({ success: false, msg: "Invalid credentials" });
  }

  if (user.isBan) {
    return res.status(403).json({
      success: false,
      msg: "User is banned and cannot perform this action",
    });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, msg: "Invalid credentials" });
  }

  // const token = user.getSignedJwtToken();
  // res.status(200).json({ success: true, token, msg: "Login Successful" });
  sendTokenResponse(user, 200, res);
};

// Get current logged in user @route POST /api/v1/auth/me @access Private
exports.getMe = async (req, res, next) => {
  // use after authmiddleware 'protect'
  // console.log(req.user);
  const user = await User.findById(req.user._id); // come from req.user = await User.findById(decoded.id); inside protect
  res.status(200).json({ success: true, data: user });
};

// @desc    Update current logged-in user's profile
// @route   PUT /api/v1/auth/me
// @access  Private
exports.updateMe = async (req, res, next) => {
  try {
    const updates = {
      name: req.body.name,
      telephone: req.body.telephone,
      
    };

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};


exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    path: "/",
  });
  // console.log(Date.now());

  res.status(200).json({
    success: true,
  });
};

exports.banUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: { $ne: "admin" } }, // Ensure not banning an admin
      { isBan: true },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or cannot be banned",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User banned successfully",
      data: user,
    });
  } catch (err) {
    console.error(err.stack);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.unbanUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id, role: { $ne: "admin" } },
      { isBan: false },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.stack(404).json({
        success: false,
        message: "User not found or cannot be unbanned",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User unbanned successfully",
      data: user,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // use milisec JWT_COOKIE_EXPIRE is a day
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  const role = user.role;
  const email = user.email;
  const name = user.name;

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, email, role, name });
};

// resetpassword


const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please make a put request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message
      });

      res.status(200).json({ success: true, message: 'Email sent' });
    } catch (err) {
      console.log(err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (err) {
    next(err);
  }
};

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Send JWT
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};
