const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const { readFileHelper, writeFileHelper } = require("../helpers/fileHelpers");
const CustomError = require("../helpers/CustomError");
const { correctPassword } = require("../helpers/validationHelpers");
const { startInterval, stopInterval } = require("../helpers/cron");

const paths = path.join(__dirname, "..", "..", "dev-db", "users.json");
const signToken = (val) =>
  jwt.sign({ email: val }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

exports.signUp = async (req, res, next) => {
  try {
    const usersData = readFileHelper(paths);
    const newUserId = Number(usersData[usersData.length - 1]?._id) + 1 || 1;
    const hashedPassword = await bcrypt.hash(req.body.password, 2);
    const token = signToken(req.body.email);
    req.body.password = hashedPassword;
    const newUser = {
      _id: newUserId,
      createdAt: new Date().toISOString(),
      ...req.body,
    };
    usersData.push(newUser);
    startInterval(newUser);
    writeFileHelper(paths, usersData, () => {
      res
        .status(200)
        .json({ result: "success", token, data: { user: newUser } });
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new CustomError("Please provide email and password", 400));
  }
  const usersData = readFileHelper(paths);
  const user = usersData.find((user) => user.email === email);
  if (!user || !(await correctPassword(password, user.password))) {
    return next(new CustomError("Incorrect email or password", 401));
  }
  const token = signToken(email);
  //When the user logs in we start the cron
  //   startInterval(user);
  //   intervalid = setInterval(startInterval(user), duration);
  startInterval(user);
  res.status(200).json({ result: "success", token });
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    const usersData = readFileHelper(paths);
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
