process.env.NODE_ENV = "test";
const fs = require("fs");
const {
  readFileHelper,
  writeFileHelper,
} = require("../../src/helpers/fileHelpers");
const expect = require("chai").expect;

describe("File operations", () => {
  context("reading a file", () => {
    const path = "./tests/helpers/test.json";
    const data = { name: "ed" };
    before(() => {
      console.log("---before test case---");
      fs.writeFileSync(path, JSON.stringify(data));
    });
    after(() => {
      console.log("---Once after test case---");
      fs.unlinkSync(path);
    });

    it("Should return a data from JSON file", (done) => {
      const result = readFileHelper(path);
      expect(result).to.deep.equal(data);
      done();
    });
    it("should throw an error if file path is invalid", () => {
      const path = "./test_files/invalid.json";
      expect(() => readFileHelper(path)).to.throw();
    });
  });
  context("Writing to a file", () => {
    it("Should write data to json file", () => {
      after(() => {
        console.log("---Once after test case---");
        fs.unlinkSync(path);
      });
      const data = { name: "ed" };
      const path = "./tests/helpers/test.json";
      writeFileHelper(path, data, () => {
        const response = JSON.parse(fs.readFileSync(path, "utf8"));
        expect(response).to.deep.equal(data);
      });
    });
    it("should throw an error if file path is invalid", () => {
      const data = { name: "ed" };
      const path = "./test_files/invalid.json";
      writeFileHelper(path, data, (err) => {
        expect(err.code).to.equal("ENOENT");
      });
    });
  });
});
