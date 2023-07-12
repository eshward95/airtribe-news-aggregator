const bcrypt = require("bcryptjs");

exports.checkAlreadyEmailExists = (val, usersData) => {
  return usersData.some(({ email }) => val == email);
};

exports.correctPassword = (password, hashPassword) => {
  return bcrypt.compare(password, hashPassword);
};

exports.checkIdAlreadyAdded = (id, articleList) => {
  return articleList.some((res) => res.id === id);
};
