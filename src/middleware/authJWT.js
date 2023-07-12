const CustomError = require("./../helpers/CustomError");
const { readFileHelper } = require("../helpers/fileHelpers");
const path = require("path");
const jwt = require("jsonwebtoken");
const usersPath = path.join(
  __dirname,
  "..",
  "..",
  "dev-db",
  `${process.env.USER_FILE_DB_NAME}`
);
exports.protect = async (req, res, next) => {
  try {
    let token;
    const usersData = readFileHelper(usersPath);
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(new CustomError("You are not logged in", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const loggedInUser = usersData.find((user) => user.email === decoded.email);
    if (!loggedInUser) {
      return next(new CustomError("User details not available", 401));
    }
    req.user = loggedInUser;
    next();
  } catch (err) {
    next(new CustomError(err.message, 401));
  }
};
