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
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0]; // e.g. 'email' or 'telephone'
      return res.status(400).json({
        success: false,
        message: `The ${field} is already in use.`
      });
    }

    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(400).json({
      success: false,
      message: err.message || 'Server error'
    });
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


const sendEmail = async (option) => {
  const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    }
  });

  const message = {
    from: process.env.SMTP_EMAIL,
    to: option.email,
    subject: option.subject,
    html:
    `<div style="max-width: 700px; margin: 40px auto; padding: 40px 30px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2); border: 1px solid #d1fae5;">
    
   
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://i.postimg.cc/wBJtkWWk/Rosa-Maria.jpg" alt="SABAAI Logo" style="max-width: 200px; border-radius: 10px;" />
    </div>
    
    <h2 style="text-align: center; font-size: 24px; color: #065f46; margin-bottom: 20px;">Hi ${option.toUser},</h2>
    
    <p style="font-size: 16px; line-height: 1.6; color: #374151; text-align: center;">
      You've enabled <strong>2-Step Verification</strong> on your account.
    </p>

    <div style="background-color: #ecfdf5; border: 1px dashed #10b981; padding: 20px; margin: 30px 0; border-radius: 8px; text-align: center;">
      <p style="font-size: 18px; color: #065f46; margin: 0 0 10px;">Your OTP Code</p>
      <p style="font-size: 28px; font-weight: bold; color: #059669; letter-spacing: 4px;">${option.OTP}</p>
    </div>

    <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
      You'll need this 6-digit security code to confirm sensitive actions such as signing in. Please enter it in the verification field provided.
    </p>

    <p style="font-size: 16px; color: #10b981; font-weight: bold; margin-top: 30px;">Sabaai</p>

    <div style="font-size: 13px; color: #9ca3af; margin-top: 40px; text-align: left; border-top: 1px solid #e5e7eb; padding-top: 20px;">
      This message was generated by <a href="https://sabaai.vercel.app" style="color: #10b981; text-decoration: none;">https://sabaai.vercel.app/</a>.
    </div>
  </div>` 
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  console.log('Attempting to find user with email:', email);

  try {
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Get reset OTP
    console.log('Generating reset OTP...');
    const otp = user.getResetPasswordToken();
    console.log('Reset OTP generated');

    await user.save({ validateBeforeSave: false });
    console.log('User saved with reset OTP');

    try {
      console.log('Attempting to send email...');
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP',
        message: `Your password reset OTP is: ${otp}\n\nThis OTP will expire in 10 minutes.`
      });
      console.log('Email sent successfully');

      res.status(200).json({ success: true, message: 'Email sent' });
    } catch (err) {
      console.error('Error sending email:', err);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (err) {
    console.error('Error in forgotPassword:', err);
    next(err);
  }
};

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:otp
// @access    Public
exports.resetPassword = async (req, res, next) => {
  // Get hashed OTP
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.otp).digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
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


// @desc      Validate OTP for password reset
// @route     GET /api/v1/auth/validate-otp/:resettoken
// @access    Public
exports.validateOtp = async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'The OTP is invalid or has expired. Please try again.' });
    }

    // If OTP is valid, return success
    return res.status(200).json({ success: true, message: 'OTP is valid' });
  } catch (err) {
    next(err);
  }
};
