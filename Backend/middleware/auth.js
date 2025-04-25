const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // only take the token part ( "bearer token" )
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorize to access this route" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = await User.findById(decoded.id);

    if (req.user.isBan) {
      return res.status(403).json({
        success: false,
        message: "User is banned and cannot perform this action",
      });
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" });
    }

    next();
  } catch (err) {
    console.log(err.stack);
    return res
      .status(401)
      .json({ success: false, message: "Not authorize to access this route" });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  // roles become an array
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // user role don't match roles mean it's unauthorize
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
