const path = require("path");
const { readFileHelper } = require("./fileHelpers");
const bcrypt = require("bcryptjs");

const paths = path.join(__dirname, "..", "..", "dev-db", "users.json");
const usersData = readFileHelper(paths);

exports.checkAlreadyEmailExists = (val) => {
  return usersData.some(({ email }) => val == email);
};

exports.correctPassword = (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};

exports.checkIdAlreadyAdded = (id, articleList) => {
  return articleList.includes(id);
};
