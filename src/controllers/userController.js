const path = require("path");

const { readFileHelper, writeFileHelper } = require("../helpers/fileHelpers");

// const newsPath = path.join(__dirname, "..", "..", "dev-db", "news.json");
const usersPath = path.join(
  __dirname,
  "..",
  "..",
  "dev-db",
  `${process.env.USER_FILE_DB_NAME}`
);

exports.getUsers = function (req, res, next) {
  const usersData = readFileHelper(usersPath);
  return res.status(200).json({ result: "success", data: usersData });
};

exports.updateUserPreference = function (req, res, next) {
  const usersData = readFileHelper(usersPath);
  delete req.user.preference;
  const updatedUser = {
    ...req.body,
    ...req.user,
  };
  const updatedItems = usersData.map((val) =>
    val._id === req.user._id ? updatedUser : val
  );
  writeFileHelper(usersPath, updatedItems, () => {
    res.status(200).json({ result: "success", data: updatedUser });
  });
};
exports.getPreference = (req, res) => {
  res.status(200).json({ message: "success", prefernce: req.user.preference });
};
