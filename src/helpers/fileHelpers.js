const fs = require("fs");

exports.readFileHelper = (path) =>
  JSON.parse(
    fs.readFileSync(path, {
      encoding: "utf8",
    })
  );
exports.writeFileHelper = (path, data, callback) => {
  fs.writeFile(path, JSON.stringify(data), callback);
};
