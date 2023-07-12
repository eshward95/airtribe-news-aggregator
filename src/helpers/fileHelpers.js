const fs = require("fs");

exports.readFileHelper = (path) => {
  try {
    return JSON.parse(
      fs.readFileSync(path, {
        encoding: "utf8",
      })
    );
  } catch (err) {
    console.log("Error reading file", "err");
    throw new Error(err);
  }
};

exports.writeFileHelper = (path, data, callback) => {
  try {
    fs.writeFile(path, JSON.stringify(data), callback);
  } catch (err) {
    callback(err);
    // throw new Error(err);
  }
};
