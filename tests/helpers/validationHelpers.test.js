const expect = require("chai").expect;
const bcrypt = require("bcryptjs");

const validationHelpers = require("./../../src/helpers/validationHelpers");

describe("Testing the validator functions", function () {
  context("Testing Already Email added", () => {
    let email = "test@example.com";
    it("should return true if email does not exist in user data", (done) => {
      let response = validationHelpers.checkAlreadyEmailExists(email, [
        { email: "test@example.com" },
      ]);
      expect(response).to.be.true;
      done();
    });
    it("should return false if email does not exist in user data", (done) => {
      email = "test@example.co";
      let response = validationHelpers.checkAlreadyEmailExists(email, [
        { email: "test@example.com" },
      ]);
      expect(response).to.be.false;
      done();
    });
  });
  context("Testing correct password", async () => {
    const password = "password";
    let hashPassword = bcrypt.hashSync(password, 8);
    console.log(hashPassword);
    it("Should return true if password is matches the hash", async () => {
      let response = await validationHelpers.correctPassword(
        password,
        hashPassword
      );
      expect(response).to.be.true;
    });
    it("Should return false password does not match the hash", async () => {
      let response = await validationHelpers.correctPassword(
        "wrongPassword",
        hashPassword
      );
      expect(response).to.be.false;
    });
  });
  context("Check id already added to article/News list", () => {
    let id = "1";
    const list = [{ id: "1" }];
    it("Should return true if the id is already added", (done) => {
      const response = validationHelpers.checkIdAlreadyAdded(id, list);
      expect(response).to.be.true;
      done();
    });
    it("Should return false if the id is not already added", (done) => {
      id = "2";
      const response = validationHelpers.checkIdAlreadyAdded(id, list);
      expect(response).to.be.false;
      done();
    });
  });
});
