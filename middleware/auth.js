const jwt = require("jsonwebtoken");
const errors = require("../errors/index.js");
const User = require("../models/user.js");

exports.authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new errors.UnAuthenticatedError("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.userId };

    next();
  } catch (error) {
    throw new errors.UnAuthenticatedError("Authentication Invalid");
  }
};

//module.exports = auth;